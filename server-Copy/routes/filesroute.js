import express from "express";
import { rename } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { createWriteStream } from "fs";
import { STORAGE_PATH } from "../path.js";




const router=express.Router();

const PathJoiner = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(STORAGE_PATH + fixedpath);
};



router.post("/upload", (req, res, next) => {
  const filename = req?.headers?.filename;
  console.log(`./storage/${filename}`);

  const writeStream = createWriteStream(`./storage/${filename}`);
  req.on("data", (chunk) => {
    writeStream.write(chunk);
  });
  console.log("post request");
  req.on("end", () => {
    console.log("Ended writing file ");
    res.end("File uplaoded sucessfully");
  });
});


//serving file
router.get("/{*any}", (req, res) => {
  const FilePath = PathJoiner(req);

  res.setHeader("content-Disposition", "inline");
  if (req.query.action === "download") {
    res.setHeader("content-Disposition", "attachment");
    console.log("sending file");
    res.sendFile(FilePath);
  }
  res.sendFile(FilePath);
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


router.patch("/rename/{*any}", async (req, res) => {
  const FilePath = PathJoiner(req);
  console.log("File path from pathjoiner", FilePath);
  const { oldFilename, newFilename } = req?.body;

  const sourcePath = FilePath + oldFilename;
  const destinationpath = FilePath + newFilename;

  try {
    await fs.rename(sourcePath, destinationpath);
    res.status(200).json({ message: "File renamed successfully" });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(400).j;
    son({ message: "File not found or rename failed" });
  }
});



export default router