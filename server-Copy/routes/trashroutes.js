import path from "path";
import { TRASH_PATH } from "../path.js";
import { STORAGE_PATH } from "../path.js";
import express from "express"
import filesData from "../filesDB.json" with {type:'json'}
import directoriesData from "../directoriesDB.json" with {type:'json'}
import { writeFile } from "fs/promises";
const router= express.Router();



router.get("/", async (req, res, next) => {
  try {
     const directories=directoriesData.find((folder)=>folder.deleted===true)
const fileListWithMetaData=filesData.filter((file)=>file.deleted==true)
    res.json({
      filesList:fileListWithMetaData,
      directoriesList:directories
    });
  } catch (err) {
    console.log("Server error:", err);    
    res.status(500).send("Error at  server");
  }
});

//restoring
router.patch("/restore-file/:id", async (req, res, next) => {
 
const {id}=req.params;
  const fileData=filesData.find((file)=>file.id==id)
  try {
   fileData.deleted=false;
   const parentDirectory=directoriesData.find((directory)=>{
    return directory.id==fileData.parentDir;
   })
   parentDirectory.files.push(id);
   
   await writeFile("./filesDB.json",JSON.stringify(filesData));
     await writeFile("./directoriesDB.json",JSON.stringify(directoriesData));
    res.status(200).send("File restored to storage Sucessfully");
  } catch (err) {
    res.status(400).send("Error while restroing file");
    console.log("error while restoring file: ", err.message);
  }
});

router.delete("/delete-permanent/:id", async(req,res)=>{
  const {id}=req.params;
  const fileIndex=filesData.findIndex((file)=>{
    return file.id===id;
  })
   
    console.log(fileIndex);
    filesData.splice(fileIndex,1);
     await writeFile("./filesDB.json",JSON.stringify(filesData)) 
    res.status(200).json({message:"File Deleted Sucessfully"});
    
})

export default router
