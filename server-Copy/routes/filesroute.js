import express from "express";
import { rename } from "fs/promises";
import fs from "fs/promises";
import path from "node:path";
import { createWriteStream } from "fs";
import { STORAGE_PATH } from "../path.js";
import crypto from "node:crypto"
import { TempStoragePath } from "../path.js";
import filesData from "../filesDB.json" with { type: 'json' }
import { assert } from "node:console";
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
  console.log();
  
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
        
      })
   await writeFile("./filesDB.json",JSON.stringify(filesData));

    console.log("Ended writing file ");
    res.end("File uplaoded sucessfully");
  });
});


//serving file
router.get("/:id", (req, res) => {
  const FilePath = PathJoinerTemp(req);
  console.log("Hiii");
  
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
router.delete("/{*any}", async (req, res) => {
  const FilePath = PathJoiner(req);
  console.log("Path where request come: ", FilePath);

  const filename = path.basename(FilePath);
  console.log("filename: ", filename);

  const sourcePath = FilePath; // old folder
  const destPath = path.join("trash", filename);
  console.log("destination Path: ", destPath);

  try {
    await fs.rename(sourcePath, destPath);

    console.log("file moved to trash sucessfully");

    res.json({
      message: "File deleted sucessfully",
    });
  } catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete", err.message);
  }
});


router.patch("/rename/:id", async (req, res) => {
  console.log("rEQUEST IS COMING");
  const {id}=req.params;
  console.log(id);
  
  const FilePath = PathJoinerTemp(req);
  console.log("File path from pathjoiner", FilePath);
  const { oldFilename, newFilename } = req?.body;
console.log(newFilename,oldFilename);
console.log("All files in DB:", filesData.map(f => f.id));
console.log("Looking for id:", id);
  const fileData = filesData.find((file) => file.id === id);
  console.log(fileData);



  // const sourcePath = FilePath + oldFilename;
  // const destinationpath = FilePath + newFilename;



  try {
    // await fs.rename(sourcePath, destinationpath);
    res.status(200).json({ message: "File renamed successfully" });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(400).j;
    son({ message: "File not found or rename failed" });
  }
});



export default router