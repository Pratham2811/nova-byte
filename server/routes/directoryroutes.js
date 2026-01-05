import express from "express";
import { getDirectoryController } from "../controllers/directory/getDirectory.controller.js";
import { createDirectoryController } from "../controllers/directory/createDirectory.controller.js";
import { updateDirectoryController } from "../controllers/directory/updateDirectory.controller.js";
import { deleteDirectoryController } from "../controllers/directory/deleteDirectory.controller.js";
const router = express.Router();

// router.param("id", validateIdMiddleware);
router.get("/{:id}", getDirectoryController);
router.post("/create", createDirectoryController);
router.patch("/:id", updateDirectoryController);
router.delete("/:id", deleteDirectoryController);

export default router;
