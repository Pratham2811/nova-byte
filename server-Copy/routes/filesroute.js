import express from "express";
import path from "node:path";
import crypto from "node:crypto"
import { TempStoragePath } from "../path.js";
import filesData from "../filesDB.json" with { type: 'json' }
import { rm, writeFile } from "node:fs/promises";
import directoriesData from "../directoriesDB.json" with { type: 'json' }
import usersData from "../usersDB.json" with { type: 'json' }
import multer from "multer";

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
console.log("Hiii");

const upload = multer({ storage: storage })

router.post("/upload", upload.array("uploadedFiles"), async (req, res) => {
  const{uid}=req.cookies;
  const user=usersData.find((user)=>user.id===uid);

try {
let { parentDirId } = req.body;
if (!parentDirId || parentDirId === "undefined" || parentDirId === "null") {
  const rootDirectory=directoriesData.find((folder)=>folder.id===req.user.rootDirId)
  parentDirId=rootDirectory.id;

}

const uploadedFiles = req.files;

if (!uploadedFiles || uploadedFiles.length === 0) {
  return res.status(400).json({ message: "No files uploaded" });
}

const parentDirectory = directoriesData.find((d) => d.id === parentDirId);
if (!parentDirectory) {
  return res.status(404).json({ message: "Parent directory not found" });
}

uploadedFiles.forEach((file) => {
  const { id, originalname } = file;
 const extension=path.extname(file.originalname)
 console.log(extension);
 
  const fileEntry = {
    id,
    name: originalname,
    extension,
    userId:uid,
    deleted: false,
    parentDir: parentDirId,
  };

  filesData.push(fileEntry);
  parentDirectory.files.push(id);
});

await writeFile("./filesDB.json", JSON.stringify(filesData, null, 2));
await writeFile("./directoriesDB.json", JSON.stringify(directoriesData, null, 2));

res.status(201).json({
  message: `${uploadedFiles.length} file(s) uploaded successfully`,
});




} catch (error) {
console.error("Upload error:", error);
res.status(500).json({ message: "Error while uploading files" });
}
});

//serving file
router.get("/:id", (req, res) => {
  const FilePath = PathJoinerTemp(req);
  const{uid}=req.cookies
   if(req.user.id!=uid){
    return res.status(401).json({message:"Unaouthorized access "})
   }
  try{
  const {id}=req.params;
  console.log(id);
  
  const fileData=filesData.find((file)=>{
    
    
    return file.id === id
    
    
  })



  if(!fileData){
   return  res.status(404).json({message:"File Not Found"})
  }
  if(fileData.userId!=req.user.id){
        return res.status(401).json({message:"Unaouthorized access "})
  }
  console.log(fileData);
  
  const filename=`${id}${fileData.extension}`
  const FinalPath=path.join(FilePath,filename)
   res.setHeader("content-Disposition", "inline");
  
  if (req.query.action === "download") {
    res.set("content-Disposition", `attachment ;filename=${fileData.name}`);
    console.log("sending file");
    res.sendFile(FinalPath,(error)=>{
      if(!res.headersSent && error){
       return res.status(404).json({error:"File not found"})
      }
    
    });
  }
  res.sendFile(FinalPath);
}catch(error){
        res.status(400).json({message:"file Not Found"});
  }
});
//move file to trash
router.delete("/:id", async (req, res) => {
console.log("Postmanewmdjenfrjnfrjfnrjfnrj");

  const {id}=req.params;
  const {uid}=req.cookies
   

  try {
const fileIndex=filesData.findIndex((file)=>file.id==id)

if(fileIndex===-1){
  res.status.json({message:"file does not exist"})
}
  const fileData= filesData[fileIndex];
  
  if(req.user.id!==fileData.userId){
         return res.status(401).json({message:"Unaouthorized access "})
  }
  // await rm(`./storage2/${id}${fileData.extension}`)
     fileData.deleted=true;
 
  const parentDir=directoriesData.find((folderId)=>folderId.id===fileData.parentDir);
  
 
  console.log(parentDir.files);
  
 parentDir.files = parentDir.files.filter((fileId)=>fileId!==id);
 console.log(parentDir.files);
       
       await writeFile("./filesDB.json",JSON.stringify(filesData))
       await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
    res.json({
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
   
  const fileData=filesData.find((file)=>{
    return file.id === id
  })
  if(!fileData){
    return res.status(400).json({message:"File not found "})
  }
    
  if(req.user.id!==fileData.userId){
         return res.status(401).json({message:"Unaouthorized access "})
  }
  
  fileData.name=newFilename;
await writeFile("./filesDB.json", JSON.stringify(filesData, null, 2));
  res.status(200).json({message:"File renamed sucessfully"})
 } catch (error){
  error.status=510
    next(error);

  }
});



export default router