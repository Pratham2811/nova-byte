import express from "express"

import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { STORAGE_PATH } from "../path.js";
import { TempStoragePath } from "../path.js";
import filesData from "../filesDB.json" with {type:'json'}
import directoriesDB from "../directoriesDB.json" with {type:'json'}
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
console.log(id);


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
 console.log(files);
 
 
    res.json({ ...directoryData, files, directories });
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Error reading nested folders" });
  }
});
router.post("/create-directory", async (req, res, next) => {
 
const{foldername}=req.body
const parentdirId=req.body.parentDirId||"99b32b51-768e-489b-aa9b-a74b2795f658";




 

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
    
    
    parentDirectory.directories.push(id);
    
    await writeFile("./directoriesDB.json",JSON.stringify(directoriesData))
    res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});
router.patch("/rename/:id", async(req,res)=>{
  const{id}=req.params
  const newFilename=req.body.newName
  console.log(newFilename);
  
  console.log(id);
  const directory=directoriesDB.find((folder)=>{
   return  folder.id===id;
  })
  console.log(directory);
  directory.name=newFilename;
 await writeFile("./directoriesDB.json",JSON.stringify(directoriesDB))
  res.send("directory renamed");
  
  
})
router.delete("/:id",async(req,res)=>{
     const { id } = req.params;
  console.log("Deleting directory:", id);

  try {
    // Find the directory to delete
    const directoryIndex = directoriesDB.findIndex((folder) => folder.id == id);
    if (directoryIndex === -1) {
      return res.status(404).json({ message: "Directory not found" });
    }

    const directoryData = directoriesDB[directoryIndex];
    console.log("directory data:", directoryData);


    async function recursive(filesId, directoriesId) {
 
      if (filesId && filesId.length) {
        for await (const fileId of filesId) {
          const fileIndex = filesData.findIndex((file) => file.id == fileId);
          if (fileIndex !== -1) {
            const fileData = filesData[fileIndex];
            // Delete file from storage
            console.log(fileId+fileData.extension);
            const filePath=path.join(TempStoragePath,fileId+fileData.extension);
            console.log(filePath);
            
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
  const parentDir=directoriesDB.find((folder)=>{
    return folder.id===directoryData.parentDir;
  })
  if (parentDir) {
  parentDir.directories = parentDir.directories.filter(did => did !== id);
}

    directoriesDB.splice(directoryIndex, 1);
   
 
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesDB));
    await writeFile("./filesDB.json", JSON.stringify(filesData));

    res.json({ message: "Folder deleted successfully" });
      } catch (err) {
    console.error("Error deleting directory:", err);
    res.status(500).json({ message: "Internal server error" });
  }

})
export default router;