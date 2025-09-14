import express from "express";
import { rename } from "fs/promises";
import fs from "fs/promises";
import path from "node:path";
import { createWriteStream } from "fs";
import { STORAGE_PATH } from "../path.js";
import crypto from "node:crypto"
import { TempStoragePath } from "../path.js";
import filesData from "../filesDB.json" with { type: 'json' }
import { assert, log } from "node:console";
import { writeFile } from "node:fs/promises";



const router=express.Router();

console.log(TempStoragePath);

const PathJoiner = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(STORAGE_PATH + fixedpath);
};
const PathJoinerTemp = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(TempStoragePath + fixedpath);
};


router.post("/upload",  (req, res, next) => {
  const filename = req?.headers?.filename;
  const FolderPath=req?.headers?.path
  console.log(FolderPath);
  
  const id=crypto.randomUUID();
  console.log(id);
  const extension=path.extname(filename);
  const FullFilename=`${id}${extension}`
  console.log(FullFilename);
  
  const abosolutepath=PathJoinerTemp(req);
 const FilePath=path.join(abosolutepath,FullFilename)
console.log(FilePath);

  const writeStream = createWriteStream(FilePath);
 req.pipe(writeStream);
  console.log("post request");
  req.on("end", async () => {
      filesData.push({
        id,
        extension,
        name:filename,
        deleted:false,

        
      })
   await writeFile("./filesDB.json",JSON.stringify(filesData));

    console.log("Ended writing file ");
    res.end("File uplaoded sucessfully");
  });
});


//serving file
router.get("/:id", (req, res) => {
  const FilePath = PathJoinerTemp(req);
  console.log("Hiii fuckfnrjifj");
  
  const {id}=req.params;
  console.log(id);
  
  const fileData=filesData.find((file)=>{
    
    
    return file.id === id
    
    
  })


  
  const filename=`${id}${fileData.extension}`

  const FinalPath=path.join(FilePath,filename)
  console.log(FinalPath);
  
  
  
  res.setHeader("content-Disposition", "inline");
  if (req.query.action === "download") {
    res.setHeader("content-Disposition", "attachment");
    console.log("sending file");
    res.sendFile(FinalPath);
  }
  res.sendFile(FinalPath);
});


//move file to trash
router.delete("/:id", async (req, res) => {
  const FilePath = PathJoinerTemp(req);
  console.log("Hiii");
  console.log(FilePath);
  const {id}=req.params;
  const filename = path.basename(FilePath);
 
  try {
const fileData=filesData.find((file)=>file.id==id)
  fileData.deleted=true;
   await writeFile("./filesDB.json",JSON.stringify(filesData));
    res.json({
      message: "File deleted sucessfully",
    });
  } catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete", err.message);
  }
});


router.patch("/rename/:id", async (req, res) => {
  const {id}=req.params;
  const FilePath = PathJoinerTemp(req);
  const { oldFilename, newFilename } = req?.body;
  try{
  const fileData=filesData.find((file)=>{
    return file.id === id
  })
  if(!fileData){
    return res.status(400).json({message:"File not found "})
  }
  fileData.name=newFilename;
await writeFile("./filesDB.json", JSON.stringify(filesData, null, 2));
  res.status(200).json({message:"File renamed sucessfully"})
 } catch (err) {
    console.error("Rename error:", err);
    res.status(400).json({ message: "File not found or rename failed" });
  }
});



export default router