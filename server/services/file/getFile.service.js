import FileModel from "../../models/FileModel.js";
import { AppError } from "../../utils/AppError.js";

export const getFileService = async ({ fileId, userId }) => {
  const file = await FileModel.findOne({ _id: fileId })
    .select("name storagePath extension mimeType state userId")
    .lean();

  if (!file) {
    throw new AppError("File not found", 404);
  }

  if (file.userId.toString() !== userId) {
    throw new AppError("Access denied", 403);
  }

  if (file.state !== "ACTIVE") {
    throw new AppError("File not available", 403);
  }

  return file; // INTERNAL OBJECT
};
