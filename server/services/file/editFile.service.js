import FileModel from "../../models/FileModel.js";
import { AppError } from "../../utils/AppError.js";

export const editFileService = async ({ fileId, userId, newFilename }) => {
  if (newFilename.length === 0) {
    throw new AppError("File name cannot be empty", 400);
  }

  const result = await FileModel.findOneAndUpdate(
    {
      _id: fileId,
      userId,
      state: "ACTIVE", 
    },
    {
      name: newFilename,
    },
    {
      new: false, 
    }
  );

  if (!result) {
    throw new AppError("File not found or access denied", 404);
  }

  return;
};
