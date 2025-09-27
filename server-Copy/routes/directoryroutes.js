import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import filesData from "../filesDB.json" with {type:'json'}
import directoriesDB from "../directoriesDB.json" with {type:'json'}
import { writeFile } from "fs/promises";
  
const router=express.Router()

 const PathJoiner = (req) => {
   // console.log(req.params.any);
 
   const fixedpath = path.join(
     "/",
     req.params.any ? req.params.any.join("/") : ""
   );
 
   return path.join(STORAGE_PATH + fixedpath);
 }; 




router.get("/{:id}", async (req, res) => {
console.log("Hii");
const {id}=req.params
console.log(id);
  try {
if(id){
  const directoryData=directoriesDB.find((folder)=>folder.id==id);
    const files=directoryData.files.map((fileId)=>{
       
      return filesData.find((file)=>file.id===fileId)
     
    })  
    const directories=directoryData.directories.map((folderInfo)=>{
      return directoriesDB.find((folderId)=>folderId.id===id)
    })
    console.log("directories data:",directories);
    
console.log(directoryData);
 res.json({...directoryData,files});

}else{
const directoryData=directoriesDB[0];
    console.log(directoryData);
    const files=directoryData.files.map((fileId)=>{
       
      return filesData.find((file)=>file.id===fileId)
     
    })
      res.json({...directoryData,files});
}

  

   
  } catch (error) {
    console.error("server Error", error);
    res.status(500).json({ message: "Error reading nested Folders" });
  }
});

router.post("/create-directory", async (req, res, next) => {
 
const{foldername,parentdirId}=req.body
console.log(parentdirId);

 

  try {
    const directoriesData=directoriesDB;
    console.log(directoriesData);
    const id=crypto.randomUUID();
    console.log(id);
    
    directoriesData.push({
      id:id,
      name:foldername,
      parentDir:parentdirId,
      files:[],
      directories:[]

    })
    const parentDirectory=directoriesData.find((directory)=>directory.id===parentdirId)
    parentDirectory.directories.push(parentdirId);
    
    await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
    res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});
export default router;