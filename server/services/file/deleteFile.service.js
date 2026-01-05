import mongoose from "mongoose";
import FileModel from "../../models/FileModel.js";
import fs from "node:fs/promises";
import path from "node:path";

export const deleteFileService = async ({ fileId, userId }) => {
  const session = await mongoose.startSession();

  let file;

  try {
    session.startTransaction();

    file = await FileModel.findOneAndDelete(
      { _id: fileId, userId },
      { session }
    ).lean();

    if (!file) {
      throw new AppError("File not found", 404);
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  try {
    const filePath = path.resolve(file.storagePath);
    await fs.rm(filePath, { force: true });
  } catch (cleanupErr) {
    console.error("File cleanup failed", {
      fileId,
      path: file.storagePath,
      error: cleanupErr.message,
    });
   
  }
};
