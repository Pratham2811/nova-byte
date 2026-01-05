import express from "express";
import { validateIdMiddleware } from "../middlewares/validateIdMiddleware.js";
import { getFileController } from "../controllers/file/getFile.controller.js";
import { uploadFileController } from "../controllers/file/uploadFile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import checkAuth from "../middlewares/authMiddleware.js";
import { deleteFileController } from "../controllers/file/deleteFile.controller.js";
import { editFileController } from "../controllers/file/editFile.controller.js";
const router = express.Router();

router.post("/upload", upload.array("uploadedFiles"), uploadFileController);
router.get("/:id", getFileController);
router.delete("/:id", checkAuth, deleteFileController);
router.patch("/:id", checkAuth, editFileController);

router.param("id", validateIdMiddleware, () => {
  console.log("rename was running");
});

export default router;
