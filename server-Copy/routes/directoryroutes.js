import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import filesData from "../filesDB.json" with {type:'json'}

  
const router=express.Router()







 
 const PathJoiner = (req) => {
   // console.log(req.params.any);
 
   const fixedpath = path.join(
     "/",
     req.params.any ? req.params.any.join("/") : ""
   );
 
   return path.join(STORAGE_PATH + fixedpath);
 }; 


console.log(filesData);

router.get("/{*any}", async (req, res) => {

    
  try {
    // const Finalpath = PathJoiner(req);

    // const fileList = await fs.readdir(Finalpath);

    // const fileListWithMetaData = await Promise.all(
    //   fileList.map(async (file) => {
    //     const filePath = path.join(Finalpath, file);
    //     const fileStat = await fs.stat(filePath);
    //     return {
    //       name: file,
    //       type: fileStat.isDirectory() ? "folder" : "file",
    //       size: fileStat.size,
    //     };
    //   })
    // );

    const fileListWithMetaData=filesData.filter((file)=>file.deleted==false)
  console.log(fileListWithMetaData);
  
    res.json(fileListWithMetaData);
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