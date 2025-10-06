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
  const { id } = req.params;
console.log("Hii");

  try {
    const directoryData = id
      ? directoriesDB.find((folder) => folder.id == id)
      : directoriesDB[0];

    if (!directoryData) {
      return res.status(404).json({ message: "Directory not found" });
    }

    const files = directoryData.files.map((fileId) => {
      return filesData.find((file) => file.id === fileId);
    });
     
    const directories = directoryData.directories.map((folderId) => {
      return directoriesDB.find((dir) => dir.id === folderId);
    });
 console.log(directories);
 
    res.json({ ...directoryData, files, directories });
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Error reading nested folders" });
  }
});
router.post("/create-directory", async (req, res, next) => {
 
const{foldername}=req.body
const parentdirId=req.body.parentDirId||"99b32b51-768e-489b-aa9b-a74b2795f658";
console.log("directoery id:",parentdirId);
console.log("Folder Name: ",foldername);



 

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
    
    // await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
    res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});
export default router;