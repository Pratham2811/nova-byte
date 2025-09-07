import { readdir } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { TRASH_PATH } from "../path.js";
import { STORAGE_PATH } from "../path.js";
import express from "express"
import { rename } from "fs/promises";
const router= express.Router();

const PathJoinertrash = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(TRASH_PATH + fixedpath);
};


 
 const PathJoiner = (req) => {
   // console.log(req.params.any);
 
   const fixedpath = path.join(
     "/",
     req.params.any ? req.params.any.join("/") : ""
   );
 
   return path.join(STORAGE_PATH + fixedpath);
 };
router.get("/", async (req, res, next) => {
  try {
    const directoryPath = "trash";
    const fileList = await readdir("trash");

    const fileListWithMetaData = await Promise.all(
      fileList.map(async (file) => {
        const filePpath = path.join(directoryPath, file);
        const fileStat = await fs.stat(filePpath);
        return {
          name: file,
          type: fileStat.isDirectory() ? "folder" : "file",
          size: fileStat.size,
        };
      })
    );

    res.json(fileListWithMetaData);
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).send("error from server");
  }
});

//restoring
router.patch("/restore-file/{*any}", async (req, res, next) => {
    console.log(req.body);
    
   const {FilenametoRestore}=req.body;
    console.log(FilenametoRestore);
    
  const SourcePath = PathJoinertrash(req)+FilenametoRestore;
  const Destinationpath = PathJoiner(req)+FilenametoRestore;
  console.log(SourcePath);
  console.log(Destinationpath);
  try {
    await rename(SourcePath, Destinationpath);
    res.status(200).send("File restored to storage Sucessfully");
  } catch (err) {
    res.status(400).send("Error while restroing file");
    console.log("error while restoring file: ", err.message);
  }
});


export default router