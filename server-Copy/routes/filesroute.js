import express from "express";
import path from "node:path";
import crypto from "node:crypto"
import { TempStoragePath } from "../path.js";

import { rm, writeFile } from "node:fs/promises";

import multer from "multer";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getFilesCollection } from "../config/filesCollection.js";
import { getDirsCollection } from "../config/dirCollection.js";




const router=express.Router();


 
const PathJoinerTemp = (req) => {
  

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(TempStoragePath + fixedpath);
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage2')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const id=crypto.randomUUID();
    const extension=path.extname(file.originalname)
    file.id=id;
    cb(null, `${id}${extension}`);

  }
})


const upload = multer({ storage: storage })

router.post("/upload", upload.array("uploadedFiles"), async (req, res,next) => {
try {
let { parentDirId } = req.body|| {};

//db calll
const dirsCollection=getDirsCollection(req); 

if (!parentDirId || parentDirId === "undefined" || parentDirId === "null") {
const rootDirectory=await dirsCollection.findOne({id:req.user.rootDirId});

parentDirId=rootDirectory.id;
}


const uploadedFiles = req.files;
if (!uploadedFiles || uploadedFiles.length === 0) {
  return res.status(400).json({ message: "No files uploaded" });
}

const filesCollection=getFilesCollection(req)
 const fileIdsToPush = [];
    const insertPromises = uploadedFiles.map((file) => {
      // multer may not provide `id`; generate one
      const fileId = file.id;
      const originalname = file.originalname || file.filename || fileId;
      const extension = path.extname(originalname);
      if(!fileId || !originalname|| !extension){
        return res.status(500).json({
          status:"error",
          message:"Internal server error",

        })
      }
      const fileEntry = {
        id: fileId,
        name: originalname.trim(),
        extension,
        mimeType: file.mimetype || null,
        size: file.size ?? null,
        userId: req.user.id,     // use authenticated user id (NOT raw cookie)
        deleted: false,
        parentDir: parentDirId,
        createdAt: new Date(),
      };
      fileIdsToPush.push(fileId);
      return filesCollection.insertOne(fileEntry);
    });


    const insertResults = await Promise.all(insertPromises);

   
   
res.status(201).json(
  {
 
    status:"success",
    message:`${uploadedFiles.length} file(s) uploaded successfully`,
}
);
} catch (error) {
console.error("Upload error:", error);
res.status(500).json({ message: "Error while uploading files" });
}
});

//serving file
router.get("/:id",async (req, res,next) => {
const {id}=req.params;
// validateIdMiddleware(req,res,next,id);
const FilePath = PathJoinerTemp(req);
const{uid}=req.cookies

try{

  //db call
const filesCollection=getFilesCollection(req)
const fileData= await filesCollection.findOne({id:id},{projection:{id:1,extension:1,_id:0,userId:1,name:1}})
if(fileData.userId!=req.user.id){
    return res.status(403).json(
      {status:"error",
      message:"Unaouthorized access "
      }
)
}
if(!fileData || fileData===null){
    return res.status(404).json(
      {status:"error",
       message:"File not found"

      }
)
}

const filename=`${id}${fileData.extension}`
const FinalPath=path.join(FilePath,filename)
res.setHeader("content-Disposition", "inline");
  
if (req.query.action === "download") {  
return res.download(FinalPath,fileData.name)
  }
res.sendFile(FinalPath);


}catch(error){
        res.status(404).json({
          status:"error",
          message:"file Not Found"
        });
  }
});
//move file to trash
router.delete("/:id", async (req, res) => {
const {id}=req.params;
 
try {
  //db call  
const filesCollection=getFilesCollection(req);
const dirsCollection=getDirsCollection(req);
const fileData= await filesCollection.findOne({id:id},{projection:{id:1,extension:1,_id:0,userId:1,parentDir:1}});

if(!fileData){
  res.status(404).json(
    {
      status:"error",
      message:"file does not exist"
    }
  )
}

if(req.user.id!==fileData.userId){
 
   
      return res.status(401).json({message:"Unaouthorized fdfdbgbgfb access "})
}

const filePath = `./storage2/${id}${fileData.extension || ""}`;
    try {
      await rm(filePath, { force: true });
    } catch (fsErr) {
      // Log but continue — we'll still remove metadata
      console.warn("Warning removing file from disk:", fsErr?.message || fsErr);
    }
const deleteMetaResult=await filesCollection.deleteOne({id:id});
if (deleteMetaResult.deletedCount !== 1) {
   console.warn("filesCollection.deleteOne did not delete a document:", deleteMetaResult);   
}

 
res.status(200).json({
     status:"sucess",
      message: "File deleted sucessfully",
});
} catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete", err.message);
}
});


router.patch("/rename/:id", async (req, res,next) => {
  
  const {id}=req.params;
  const FilePath = PathJoinerTemp(req);
  const { oldFilename, newFilename } = req?.body;
  if(!newFilename){
    return res.status(404).json({message:"Please Enter the file name "})
  }
try{
  //db call
  const filesCollection=getFilesCollection(req);
  const fileUpdation=await filesCollection.updateOne({id},{$set:{name:newFilename}})
  if(fileUpdation.modifiedCount!==1){
    return res.status(500).json({
      status:"error",
      message:"Internal Server Error"
    })
  }

  res.status(200).json(
    {
      status:"successror",
    message:"File renamed sucessfully"
    }
)
 } catch (error){
  error.status=510
    next(error);

  }
});

router.param("id",validateIdMiddleware)
router.param("/rename/id",validateIdMiddleware,()=>{
  console.log("rename was running");
  
})
export default router