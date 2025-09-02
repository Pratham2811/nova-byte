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

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

//enabling cors
// app.use((req, res, next) => {
//   res.set({
//     "access-control-allow-origin": "*",
//     "access-control-allow-Methods": "*",
//     "access-control-allow-Headers": "*",
//   });
//   next();
// });

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

//serving directory content
app.get("/directory", async (req, res, next) => {
  try {
    // const {filename}=req.params;
    // console.log(filename);

    console.log("request for root diurectory");

    const directoryPath = `./storage`;
    const fileList = await readdir(directoryPath);
    console.log(fileList);
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
    // console.log(fileListWithMetaData);
    res.json(fileListWithMetaData);
  } catch (error) {
    console.log("server Error", error);
  }
});

// Nested directories (any depth)
app.get("/directory/{*splat}", async (req, res) => {
  try {
    const filename = req.params.splat;
    const direPath = filename.join("/");
    console.log(direPath);

    const directoryPath = path.join(_dirname, "storage", direPath);
    const fileList = await fs.readdir(directoryPath);

    const fileListWithMetaData = await Promise.all(
      fileList.map(async (file) => {
        const filePath = path.join(directoryPath, file);
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
    console.log(fileList);
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
app.get("/files/{*splat}", (req, res) => {
  const url = decodeURIComponent(req.url);
  const FullPathArray = req.params.splat;
  console.log(FullPathArray);
  const FiletoPath = FullPathArray.join("/");

  const filePath = path.join(_dirname, "storage", FiletoPath);

  res.setHeader("content-Disposition", "inline");
  if (req.query.action === "download") {
    res.setHeader("content-Disposition", "attachment");
    console.log("sending file");
    res.sendFile(filePath);
  }
  res.sendFile(filePath);
});

//move file to trash
app.delete("/files/{*splat}", async (req, res) => {
  const FullPathArray = req.params.splat;
  const PathtoFile = FullPathArray.join("/");
  console.log(PathtoFile);
  const size = FullPathArray.length;
  const filename = FullPathArray[size - 1];
  console.log(filename);

  const sourcePath = path.join(_dirname, "storage", PathtoFile); // old folder
  const destPath = path.join(_dirname, "trash", filename);

  try {
    await fs.rename(sourcePath, destPath);

    console.log("file moved to trash sucessfully");

    res.json({
      message: "File deleted sucessfully",
    });
  } catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete");
  }
});

app.patch("/files/rename/{*splat}", async (req, res) => {
  try {
    const FullPathArray = req.params.splat;

    const FiletoPath = FullPathArray.join("/");

    const oldName = path.join(_dirname, "storage", FiletoPath); // use params
    console.log("Old File path: ", oldName);
    const size = FullPathArray.length;
    const NewPath = FullPathArray?.slice(0, size - 1);
    const WholeNewPath = NewPath?.join("/");
    console.log(WholeNewPath);

    const newFileName = path.join(
      _dirname,
      "storage",

      WholeNewPath,
      req.body.fileName
    ); // use body
    console.log("New File Wholw Path:", newFileName);

    await fs.rename(oldName, newFileName);

    res.status(200).json({ message: "File renamed successfully" });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(400).json({ message: "File not found or rename failed" });
  }
});

//restoring
app.patch("/files/restore-file/{*splat}", async (req, res, next) => {
  console.log("request came");
console.log(req.params.splat);
  res.send("file restored sucessfully");


  // const sourcePath = `./trash/${filename}`;
  // const destPath = `./storage/${filename}`;
  // console.log(sourcePath);
  // try {
  //   await rename(sourcePath, destPath);
  //   res.send("file restored sucessfully");
  // } catch (err) {
  //   res.status(500).send("Error Restoring file due to wrong path");
  // }
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
