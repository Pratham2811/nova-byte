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
router.param("/rename/id",validateIdMiddleware) 

router.get("/{:id}", async (req, res) => {
let { id } = req.params;
const {uid}=req.cookies
if(uid!==req.user.id){
  return res.status(401).json({message:"Unauthorized access"})
 }

try {
//call to dirs collection
const dirsCollection=getDirsCollection(req);
let dirsData=await dirsCollection.findOne({id:id})
if(!id &&dirsData===null){
const userId=req.user.id;


  dirsData=await dirsCollection.findOne({userId})
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
if (dirsData.userId !== req.user.id) {
  return res.status(403).json({message:"Forbidden"})
}

//call to file collection 

const filesCollection=getFilesCollection(req);
const files=await filesCollection.find({parentDir:id}).toArray();



//call to dir here
// const directories= await Promise.all( dirsData.directories.map(async (dirId)=>{
//   return  dirsCollection.findOne({id:dirId})
// }))
const directories=await dirsCollection.find({parentDir:id}).toArray();
return res.status(200).json({ ...dirsData, files, directories });
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
console.log(parentdirId);

//call to directory collection


 
  try {
const dirsCollection=getDirsCollection(req);
const parentDir= await dirsCollection.findOne(
  {
    id:parentdirId,
  }
)

if(!parentDir) return res.status(404).json(
  {
    status:"error",
    message:"Parent directory does not Exist"
  }
)  


if(parentDir.userId!==req.user.id){
      return res.status(401).json(
        {
          status:"error",
          message:"Unaouthorized access "
        }
      );
}

const id=crypto.randomUUID();
//insert in db --db call
const directoryData={
  
      id:id,
      name:foldername||"New Folder",
      parentDir:parentdirId,
      userId:uid,
      deleted:false,

    
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
    const directory=dirsCollection.updateOne({id:id},{$set:{name:newFilename}});

 
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


router.delete("/:id",async(req,res,next)=>{
     const { id } = req.params;
    const dirsCollection=getDirsCollection(req);


  try {


  async function recursiveDeleteDirs(id) {
  try {
    const children = await dirsCollection
      .find({ parentDir: id }, { projection: { id: 1, _id: 0 } })
      .toArray();

    if (!children || children.length === 0) {
      const res = await dirsCollection.deleteOne({ id });
      console.log('Deleted leaf:', id, 'deletedCount=', res.deletedCount);
      return;
    }

    for (const child of children) {
      await recursiveDeleteDirs(child.id);
    }

    const res = await dirsCollection.deleteOne({ id });
    console.log('Deleted:', id, 'deletedCount=', res.deletedCount);
  } catch (err) {
    console.error('Error deleting dir', id, err);
    throw err;
  }
}

    const result=recursiveDeleteDirs(id);
    
    


   return  res.status(200).json({ message: "Folder deleted successfully" });
      } catch (err) {
    console.error("Error deleting directory:", err);
    res.status(500).json({ message: "Internal server error" });
  }

})
export default router;