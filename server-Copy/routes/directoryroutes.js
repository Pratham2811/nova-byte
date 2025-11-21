import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import { TempStoragePath } from "../path.js";
import { writeFile,rm } from "fs/promises";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getDirsCollection } from "../config/dirCollection.js";

import { getUsersCollection } from "../config/userCollection.js";
import { getFilesCollection } from "../config/filesCollection.js";
import { ObjectId } from "mongodb";
import { normalizeDoc } from "../utils/apiDataFormat.js";
const router=express.Router()

 const PathJoiner = (req) => {
   // console.log(req.params.any);
 
   const fixedpath = path.join(
     "/",
     req.params.any ? req.params.any.join("/") : ""
   );
 
   return path.join(TempStoragePath + fixedpath);
 }; 




router.param("id",validateIdMiddleware)

router.get("/{:id}", async (req, res) => {
  console.log(req.params);
  
let { id } = req.params;
const {uid}=req.cookies




if(uid!==req.user.id){
  console.log(req.user.id);
  return res.status(401).json({message:"Unauthorized access "})
 }

try {
//call to dirs collection
const dirsCollection=getDirsCollection(req);
let dirsData=normalizeDoc(await dirsCollection.findOne({_id:new ObjectId(id)},{projection:{deleted:0}}))
if(!id &&dirsData===null){
const userId=req.user.id;
console.log(new  ObjectId(userId));

  dirsData=normalizeDoc(await dirsCollection.findOne({userId:new ObjectId(userId)},{projection:{deleted:0}}))
  console.log(dirsData);
  
  
  id=dirsData.id;

}


if(!dirsData){
     return res.status(404).json(
      { 
       status:"error",
        message: "Directory not found" 
      }
    );
  }


if (dirsData.userId!== req.user.id) {
  return res.status(403).json({message:"Forbidden"})
}

//call to file collection 

const filesCollection=getFilesCollection(req);
const files=await filesCollection.find({parentDir:new ObjectId(id)}).toArray();

const apiFiles=files.map(normalizeDoc);
console.log("File data from directoryt: ",files);



const directories=await dirsCollection.find({parentDir:new ObjectId(id)}).toArray();
const apiDirectories=directories.map(normalizeDoc);
console.log("Directories data normalized ",apiDirectories);

return res.status(200).json({ ...dirsData, apiFiles, apiDirectories });
  } catch (error) {
    console.log("Server Error", error);
    res.status(500).json(
      {
         status:"error",
         message: "Error reading nested folders" 
      }
      );
  }
});


router.post("/create-directory", async (req, res, next) => {
 const {uid}=req.cookies;

const{foldername}=req.body||{};
const parentdirId=req.body.parentDirId||req.user.rootDirId;
console.log("log parent dir id",parentdirId);

//call to directory collection


 
  try {
const dirsCollection=getDirsCollection(req);
const parentDir= await dirsCollection.findOne(
  {
    _id: new ObjectId( parentdirId),
  }
)
console.log(parentDir);


if(!parentDir) return res.status(404).json(
  {
    status:"error",
    message:"Parent directory does not Exist"
  }
)  


if(parentDir.userId.toString()!==req.user.id){
      return res.status(401).json(
        {
          status:"error",
          message:"Unaouthorized access "
        }
      );
}

//insert in db --db call
const directoryData={
  
    
      name:foldername||"New Folder",
      parentDir:new ObjectId(parentdirId),
      userId:new ObjectId(req.user.id),
      deleted:false,
      createdAt: new Date()

    
}
const isDirectoryPushed= await dirsCollection.insertOne(directoryData);


return res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});


router.patch("/rename/:id", async(req,res)=>{
  const{id}=req.params

  const newFilename=req.body.newName

  if(!newFilename)  return res.status(404).json({message:"Enter New Folder name"})
try{
    //db call
    const dirsCollection=getDirsCollection(req);
    const directory=dirsCollection.updateOne({_id:new ObjectId(id)},{$set:{name:newFilename}});

 
 if(!directory) return res.status(500).json(
  {
    status:"error",
    message:"Internal server error "
  }
)
res.status(200).json({message:"Folder renamed succuscessfully"})
}catch(error){
  error.status=500;
  next(error);
}
});


router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const dirsCollection = getDirsCollection(req);
  const filesCollection = getFilesCollection(req);

  // make sure id type matches stored id (string vs ObjectId); convert if needed here

  async function recursiveDeleteDirs(dirId) {
    try {
      // get immediate children
      const children = await dirsCollection
        .find({ parentDir: new ObjectId(dirId) }, { projection: { id: 1, _id: 0 } })
        .toArray();

    console.log(children);
    
      for (const child of children) {
        await recursiveDeleteDirs(child.id);
      }

  
      const files = await filesCollection
        .find({ parentDir: new ObjectId(dirId) }, { projection: { id: 1, extension: 1, _id: 0 } })
        .toArray();

      if (files && files.length > 0) {
      
        const rmPromises = files.map(file => {
         
          const filePath = path.join(process.cwd(), 'storage2', `${file.id}${file.extension || ''}`);
   
          return fs.rm(filePath, { force: true }).catch(err => {
          
            console.warn(`Failed to remove file ${filePath}:`, err);
          });
        });
        await Promise.all(rmPromises);

        // remove file records from DB
        const fileDelRes = await filesCollection.deleteMany({ parentDir: new ObjectId(dirId) });
        console.log(`Deleted ${fileDelRes.deletedCount} file records for dir ${dirId}`);
      }

      // finally, delete the directory document itself
      const dirDelRes = await dirsCollection.deleteOne({ _id: new ObjectId(dirId) });
      console.log(`Deleted dir ${dirId} (deletedCount=${dirDelRes.deletedCount})`);
    } catch (err) {
      console.error(`Error deleting dir ${dirId}:`, err);
      throw err;
    }
  } 
  try {
    // await the full recursive deletion BEFORE responding
    await recursiveDeleteDirs(id);

    return res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (err) {
    console.error('Error deleting directory:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;