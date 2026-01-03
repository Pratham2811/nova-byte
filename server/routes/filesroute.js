import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import { TempStoragePath } from "../path.js";

import { rm, writeFile } from "node:fs/promises";

import multer from "multer";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getFilesCollection } from "../config/filesCollection.js";
import { getDirsCollection } from "../config/dirCollection.js";
import { normalizeDoc } from "../utils/apiDataFormat.js";
import { ObjectId } from "mongodb";
import { getFileController } from "../controllers/file/getFile.controller.js";
import { uploadFileController } from "../controllers/file/uploadFile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

const PathJoinerTemp = (req) => {
  const fixedpath = path.join(
    "/",
    req.params.any ? req.params.any.join("/") : ""
  );

  return path.join(TempStoragePath + fixedpath);
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage2");
  },
  filename: function (req, file, cb) {
    console.log("frfrtrigkbjntrvkjgrvkjgrvbgrkjvbgrkjbvrgkj");

    const id = new ObjectId();
    console.log("ID from the multer bro", id);

    const extension = path.extname(file.originalname);
    file.id = id.toString();
    cb(null, `${id.toString()}${extension}`);
  },
});

// const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.array("uploadedFiles"),
  async (req, res, next) => {
    try {
      let { parentDirId } = req.body || {};

      //db calll
      const dirsCollection = getDirsCollection(req);

      if (
        !parentDirId ||
        parentDirId === "undefined" ||
        parentDirId === "null"
      ) {
        const rootDirectory = normalizeDoc(
          await dirsCollection.findOne({
            _id: new ObjectId(req.user.rootDirId),
          })
        );

        if (!rootDirectory) {
          return res.status(404).json({
            message: "No root directory found",
          });
        }
        parentDirId = rootDirectory.id;
      }
      console.log(parentDirId);

      if (!ObjectId.isValid(parentDirId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid parent directory ID",
        });
      }

      const uploadedFiles = req.files;
      console.log(req.files);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      for (const file of uploadedFiles) {
        if (!file.id || !file.originalname) {
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }
      }

      const filesCollection = getFilesCollection(req);

      const insertPromises = uploadedFiles.map((file) => {
        // multer may not provide `id`; generate one

        const fileId = file.id;

        const originalname = file.originalname || file.filename;
        const extension = path.extname(originalname);

        const fileEntry = {
          _id: new ObjectId(fileId),
          name: originalname.trim(),
          extension,
          parentDirId: new ObjectId(parentDirId),
          userId: new ObjectId(req.user.id),
          size: file.size ?? null,

          deleted: false,

          createdAt: new Date(),
        };

        return filesCollection.insertOne(fileEntry);
      });

      const insertResults = await Promise.all(insertPromises);

      res.status(201).json({
        status: "success",
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      if (error.code == 121) {
        res.status(400).json({
          status: "error",
          message: "Invalid input,Please Enter valid Detail ",
        });
      } else {
        console.log(error);

        res.status(500).json({
          status: "error",
          message: "Error reading nested folders",
        });
      }
    }
  }
);

//serving file
router.get("/:id", getFileController);

//move file to trash
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    //db call
    const filesCollection = getFilesCollection(req);
    const dirsCollection = getDirsCollection(req);
    const fileData = normalizeDoc(
      await filesCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { extension: 1, userId: 1, parentDirId: 1 } }
      )
    );
    console.log(fileData);

    if (!fileData) {
      res.status(404).json({
        status: "error",
        message: "file does not exist",
      });
    }

    if (req.user.id !== fileData.userId) {
      return res.status(401).json({ message: "Unaouthorized  access " });
    }

    const filePath = `./storage2/${id}${fileData.extension || ""}`;
    console.log(filePath);

    try {
      await rm(filePath, { force: true });
    } catch (fsErr) {
      // Log but continue — we'll still remove metadata
      console.warn("Warning removing file from disk:", fsErr?.message || fsErr);
    }
    const deleteMetaResult = await filesCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteMetaResult.deletedCount !== 1) {
      console.warn(
        "filesCollection.deleteOne did not delete a document:",
        deleteMetaResult
      );
    }

    res.status(200).json({
      status: "sucess",
      message: "File deleted sucessfully",
    });
  } catch (err) {
    res.status(400).json({ message: "File Not Found" });
    console.log("Not file found to delete", err.message);
  }
});

router.patch("/rename/:id", async (req, res, next) => {
  const { id } = req.params;

  const { oldFilename, newFilename } = req?.body;
  if (!newFilename) {
    return res.status(404).json({ message: "Please Enter the file name " });
  }
  try {
    //db call
    const filesCollection = getFilesCollection(req);
    const fileUpdation = await filesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: newFilename } }
    );
    if (fileUpdation.modifiedCount !== 1) {
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }

    res.status(200).json({
      status: "successror",
      message: "File renamed sucessfully",
    });
  } catch (error) {
    error.status = 510;
    next(error);
  }
});

router.param("id", validateIdMiddleware, () => {
  console.log("rename was running");
});

router.post(
  "/upload/test",
  upload.array("uploadedFiles"),
  uploadFileController
);

export default router;
