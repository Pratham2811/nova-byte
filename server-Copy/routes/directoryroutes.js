import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import { TempStoragePath } from "../path.js";
import filesData from "../filesDB.json" with {type:'json'}
import directoriesDB from "../directoriesDB.json" with {type:'json'}
import usersData from "../usersDB.json" with {type:'json'}
import { writeFile,rm } from "fs/promises";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getDirsCollection } from "../config/dirCollection.js";
import { Long } from "mongodb";
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
const { id } = req.params;
const {uid}=req.cookies
if(uid!==req.user.id){
  return res.status(401).json({message:"Unauthorized access"})
 }

try {
//call to dirs collection
const dirsCollection=getDirsCollection(req);
let dirsData=await dirsCollection.findOne({id:id})
if(!id &&dirsData===null){
const {id}=req.user


  dirsData=await dirsCollection.findOne({userId:id})
  

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
const files= await Promise.all( dirsData.files.map(async (fileId)=>{
  // console.log(fileId);
  return  filesCollection.findOne({id:fileId})
}))

//call to dir here
const directories= await Promise.all( dirsData.directories.map(async (dirId)=>{
  return  dirsCollection.findOne({id:dirId})
}))
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
      files:[],
      directories:[]

    
}
const isDirectoryPushed= await dirsCollection.insertOne(directoryData);
const addDirToParentDir= await dirsCollection.updateOne({id:parentdirId},{$push:{directories:id}})

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
 

  try {
    // Find the directory to delete
    const directoryIndex = directoriesDB.findIndex((folder) => folder.id == id);
    if (directoryIndex === -1) {
      return res.status(404).json({ message: "Directory not found" });
    }

    const directoryData = directoriesDB[directoryIndex];
  if(!directoryData) return res.status.json({message:"Directory Not found"})


    async function recursive(filesId, directoriesId) {
 
      if (filesId && filesId.length) {
        for await (const fileId of filesId) {
          const fileIndex = filesData.findIndex((file) => file.id == fileId);
          if (fileIndex !== -1) {
            const fileData = filesData[fileIndex];
               // Delete file from storage
           
            const filePath=path.join(TempStoragePath,fileId+fileData.extension);
         
            
            await rm(filePath).catch((err) => {console.log("broyhjer look svdfbfbebrbbefvbfbtrbrbr");
            });
            filesData.splice(fileIndex, 1);
          }
        }
      }

   
      if (directoriesId && directoriesId.length) {
        for await (const dirId of directoriesId) {
          const subDirIndex = directoriesDB.findIndex((folder) => folder.id === dirId);
          if (subDirIndex !== -1) {
            const subDirData = directoriesDB[subDirIndex];
            await recursive(subDirData.files, subDirData.directories);
        
            directoriesDB.splice(subDirIndex, 1);
         
            await rm(`./storage/${dirId}`, { recursive: true, force: true }).catch(() => {});
          }
        }
      }
    }


    await recursive(directoryData.files, directoryData.directories);
  let parentDir=directoriesDB.find((folder)=>{
    return folder.id===directoryData.parentDir;
  })
  if(!parentDir){
      parentDir=req.user.rootDirId;
  }
  if(req.user.id!==parentDir.userId){
         return res.status(401).json({message:"Unaouthorized access "})
  }
  if (parentDir) {
  parentDir.directories = parentDir.directories.filter(did => did !== id);
}

    directoriesDB.splice(directoryIndex, 1);
   
 try{
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesDB));
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    res.status(200).json({ message: "Folder deleted successfully" });
 }catch(error){
  error.status=500;
  next(error);
 }
      } catch (err) {
    console.error("Error deleting directory:", err);
    res.status(500).json({ message: "Internal server error" });
  }

})
export default router;