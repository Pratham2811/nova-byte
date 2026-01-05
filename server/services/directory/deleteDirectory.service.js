// services/directory/deleteDirectory.service.js
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { directoryModel } from "../../models/DirectoryModel.js";
import FileModel from "../../models/FileModel.js";
import { AppError } from "../../utils/AppError.js";

export const deleteDirectoryService = async (directoryId, userId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Verify root directory ownership
    const rootDir = await directoryModel.findOne(
      { _id: directoryId, userId },
      null,
      { session }
    );

    if (!rootDir) {
      throw new AppError("Directory not found or unauthorized", 404);
    }

    // 2. Collect all directories (DFS)
    const dirsToDelete = [];

    const collectDirs = async (dirId) => {
      dirsToDelete.push(dirId);

      const children = await directoryModel.find(
        { parentDirId: dirId, userId },
        "_id",
        { session }
      );

      for (const child of children) {
        await collectDirs(child._id);
      }
    };

    await collectDirs(directoryId);

    // 3. Fetch all files under these directories
    const files = await FileModel.find(
      { parentDirId: { $in: dirsToDelete }, userId },
      "storagePath",
      { session }
    ).lean();

    // 4. Delete files from filesystem (BEFORE DB commit)
    for (const file of files) {
      const filePath = path.resolve(file.storagePath);
      try {
        await fs.rm(filePath, { force: true });
      } catch {
        throw new AppError("Failed to remove file from disk", 500);
      }
    }

    // 5. Delete file records
    await FileModel.deleteMany(
      { parentDirId: { $in: dirsToDelete }, userId },
      { session }
    );

    // 6. Delete directories
    await directoryModel.deleteMany(
      { _id: { $in: dirsToDelete }, userId },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
