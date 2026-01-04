import express from "express";
import path from "node:path";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getFilesCollection } from "../config/filesCollection.js";
import { ObjectId } from "mongodb";
import { getFileController } from "../controllers/file/getFile.controller.js";
import { uploadFileController } from "../controllers/file/uploadFile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import checkAuth from "../middlewares/authMiddleware.js";
import { deleteFileController } from "../controllers/file/deleteFile.controller.js";
import { editFileController } from "../controllers/file/editFile.controller.js";
const router = express.Router();

router.post(
  "/upload",
  upload.array("uploadedFiles"),
  uploadFileController
);


router.get("/:id", getFileController);

router.delete("/:id",checkAuth,deleteFileController);
router.patch("/test/:id",checkAuth,editFileController);
router.patch("/rename/:id", async (req, res, next) => {
  const { id } = req.params;

  const { oldFilename, newFilename } = req?.body;
  if (!newFilename) {
    return res.status(404).json({ message: "Please Enter the file name " });
  }
  try {
    //db call
    

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



export default router;
