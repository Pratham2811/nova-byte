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
import { rm, writeFile } from "node:fs/promises";
import directoriesData from "../directoriesDB.json" with { type: 'json' }


const router=express.Router();


 
const PathJoinerTemp = (req) => {
  

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(TempStoragePath + fixedpath);
};


router.post("/upload",  (req, res, next) => {  
  try{
  const filename = req?.headers?.filename||"untitled";

 const parentDirId=req?.headers?.parentdirid || directoriesData[0].id;
  console.log("parent DIr:",parentDirId);

    
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
        parentDir:parentDirId,
        
        
      })
    //updatingfolder

      const pushInDirectory=directoriesData.find((folderId)=>{
      return folderId.id==parentDirId;
    })
   
    pushInDirectory.files.push(id)
        try{
            await writeFile("./filesDB.json",JSON.stringify(filesData));
       await writeFile("./directoriesDB.json",JSON.stringify(directoriesData));
       res.status(201).json({message:"File Uploaded Successfully"})
        }catch(error){
          res.status(400).json({message:"Error writing file"});
        }
 
  });}catch(error){
    res.status(500).json({message:"Could Not save Files"});
  }
});


//serving file
router.get("/:id", (req, res) => {
  const FilePath = PathJoinerTemp(req);

  try{
  const {id}=req.params;
  console.log(id);
  
  const fileData=filesData.find((file)=>{
    
    
    return file.id === id
    
    
  })


  if(!fileData){
   return  res.status(404).json({message:"File Not Found"})
  }
  const filename=`${id}${fileData.extension}`
  const FinalPath=path.join(FilePath,filename)
   res.setHeader("content-Disposition", "inline");
  
  if (req.query.action === "download") {
    res.set("content-Disposition", `attachment ;filename=${fileData.name}`);
    console.log("sending file");
    res.sendFile(FinalPath,(error)=>{
      if(!res.headersSent && error){
       return res.status(404).json({error:"File not found"})
      }
    
    });
  }
  res.sendFile(FinalPath);
}catch(error){
        res.status(400).json({message:"file Not Found"});
  }
});
//move file to trash
router.delete("/:id", async (req, res) => {

  const {id}=req.params;
  

  try {
const fileIndex=filesData.findIndex((file)=>file.id==id)

if(fileIndex===-1){
  res.status.json({message:"file does not exist"})
}
  const fileData= filesData[fileIndex];
  
  
  // await rm(`./storage2/${id}${fileData.extension}`)
     fileData.deleted=true;
 
  const parentDir=directoriesData.find((folderId)=>folderId.id===fileData.parentDir);
  
 
  console.log(parentDir.files);
  
 parentDir.files = parentDir.files.filter((fileId)=>fileId!==id);
 console.log(parentDir.files);
       
       await writeFile("./filesDB.json",JSON.stringify(filesData))
       await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
    res.json({
      message: "File deleted sucessfully",
    });
  } catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete", err.message);
  }
});


router.patch("/rename/:id", async (req, res,next) => {
  
  const {id}=req.params;
  const FilePath = PathJoinerTemp(req);
  const { oldFilename, newFilename } = req?.body;
  if(!newFilename){
    return res.status(404).json({message:"Please Enter the file name "})
  }
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
 } catch (error){
  error.status=510
    next(error);

  }
});



export default router