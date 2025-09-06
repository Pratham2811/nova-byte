import { error, log } from "console";
import express from "express";
import { createWriteStream } from "fs";
import { rename, rm } from "fs/promises";
const port = 80;
import { readdir } from "fs/promises";
import fs from "fs/promises";
import path, { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import cors from "cors";
const app = express();

//parsing request
app.use(express.json());
app.use(cors());

const absolutePathStorage = import.meta.dirname + "/storage/";
const absolutePathTrash=import.meta.dirname+"/trash/"
const PathJoiner = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(absolutePathStorage + fixedpath);
};
const PathJoinertrash = (req) => {
  // console.log(req.params.any);

  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(absolutePathTrash + fixedpath);
};
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.post("/upload", (req, res, next) => {
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

app.get("/directory/{*any}", async (req, res) => {
  try {
    const Finalpath = PathJoiner(req);

    const fileList = await fs.readdir(Finalpath);

    const fileListWithMetaData = await Promise.all(
      fileList.map(async (file) => {
        const filePath = path.join(Finalpath, file);
        const fileStat = await fs.stat(filePath);
        return {
          name: file,
          type: fileStat.isDirectory() ? "folder" : "file",
          size: fileStat.size,
        };
      })
    );

    res.json(fileListWithMetaData);
  } catch (error) {
    console.error("server Error", error);
    res.status(500).json({ message: "Error reading nested directory" });
  }
});
//serviing trash folder
app.get("/trash", async (req, res, next) => {
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

//serving file
app.get("/files/{*any}", (req, res) => {
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
app.delete("/files/{*any}", async (req, res) => {
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

app.patch("/files/rename/{*any}", async (req, res) => {
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

//restoring
app.patch("/files/restore-file/{*any}", async (req, res, next) => {
 const SourcePath=PathJoinertrash(req);
 const Destinationpath=PathJoiner(req);
 console.log(SourcePath);
  console.log(Destinationpath);
   try{
    await rename(SourcePath,Destinationpath);
    res.status(200).send("File restored to storage Sucessfully")
   }catch(err){
    res.status(400).send("Error while restroing file")
    console.log("error while restoring file: ",err.message);
    
    
   }
 

 
});

//creating directory

app.post("/create-directory", async (req, res, next) => {
  const directorArray = req.body.name;
  console.log(directorArray);

  const Finaldirpath = path.join(_dirname, "storage", directorArray);
  console.log("Final Path:", Finaldirpath);

  try {
    await fs.mkdir(Finaldirpath, { recursive: true });
    res.status(200).send("File Created sucessFully");
  } catch (err) {
    console.log("Error Creating directory", err);
    res.status(500).send(err.message);
  }
});
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
