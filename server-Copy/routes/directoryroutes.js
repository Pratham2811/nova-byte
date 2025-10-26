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

const router=express.Router()

 const PathJoiner = (req) => {
   // console.log(req.params.any);
 
   const fixedpath = path.join(
     "/",
     req.params.any ? req.params.any.join("/") : ""
   );
 
   return path.join(TempStoragePath + fixedpath);
 }; 




router.get("/{:id}", async (req, res) => {
  const { id } = req.params;
  const {uid}=req.cookies
  try {
    const directoryData = id
      ? directoriesDB.find((folder) => folder.id ===id)
      : directoriesDB.find((folder)=>folder.userId===req.user.id)
const uidData=directoriesDB.find((folder)=>folder.id===req.user.rootDirId)


    if (!directoryData) {
      return res.status(404).json({ message: "Directory not found" });
    }

    
    
if(req.user.id!==directoryData.userId){
  console.log("Hiiihfirfirifrifriftivgrvbgrjlg;jbng;jn;");
  
      return res.status(401).json({message:"Unaouthorized access "})
}


    const files = directoryData.files.map((fileId) => {
      console.log("fileId from file:",fileId);
      
      
      return filesData.find((file) => file.id === fileId);
    });
     console.log(files);
     
    const directories = directoryData.directories.map((folderId) => {
      return directoriesDB.find((dir) => dir.id === folderId);
    });

console.log(directories);

 if(uid!==req.user.id){
  return res.status(401).json({message:"Unauthorized access"})
 }
 
    return res.status(200).json({ ...directoryData, files, directories });
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Error reading nested folders" });
  }
});
router.post("/create-directory", async (req, res, next) => {
 
const{foldername}=req.body||"New Folder";
const {uid}=req.cookies
 const user=usersData.find((user)=>user.id===uid)
     const directoriesData=directoriesDB;
const parentdirId=req.body.parentDirId||req.user.rootDirId;
    
    let parentDirectory=directoriesData.find((directory)=>directory.id===parentdirId)
 
  try {

    
    if(parentDirectory.userId!==req.user.id){
          return res.status(401).json({message:"Unaouthorized access "})
    }
    const id=crypto.randomUUID();
    
    
    directoriesData.push({
      id:id,
      name:foldername,
      parentDir:parentdirId,
      userId:uid,
      files:[],
      directories:[]

    })


    if(!parentDirectory && !parentdirId){
      parentDirectory=directoriesDB.find((folder)=> folder.id===req.user.rootDirId);

    }
    if(!parentDirectory) return res.status(404).json({message:"Parent directory does not Exist"})
    
    parentDirectory.directories.push(id);
    
    await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
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

  const directory=directoriesDB.find((folder)=>{
   return  folder.id===id;
  })
 if(!directory) return res.status(404).json({message:"No directory Founded  "})
  if(directory.userId!=req.user.id){
        return res.status(401).json({message:"Unaouthorized access "})
  }
  directory.name=newFilename;

try{
 await writeFile("./directoriesDB.json",JSON.stringify(directoriesDB))
  res.status(200).json({message:"Folder renamed succuscessfully"})
}catch(error){
  error.status=500;
  next(error);
}
  
})
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