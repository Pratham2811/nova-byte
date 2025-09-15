import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import filesData from "../filesDB.json" with {type:'json'}
import directoriesDB from "../directoriesDB.json" with {type:'json'}
  
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
const directoryData=directoriesDB[0];
    console.log(directoryData);
    const files=directoryData.files.map((fileId)=>{
      console.log(fileId); 
      return filesData.find((file)=>file.id===fileId)
    })
    console.log(directoryData);  
  try {
    res.json({...directoryData,files});
  } catch (error) {
    console.error("server Error", error);
    res.status(500).json({ message: "Error reading nested directory" });
  }
});

router.post("/create-directory", async (req, res, next) => {
  const{Path,Foldername}=req?.body;
  console.log(Path);
  const FilePath=path.join(PathJoiner(req),Path,Foldername);
 console.log(FilePath);
 

  try {
    await fs.mkdir(FilePath, { recursive: true });
    res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});
export default router;