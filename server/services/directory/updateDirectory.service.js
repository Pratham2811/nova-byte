import { directoryModel } from "../../models/DirectoryModel.js";
import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";

export const updateDirectoryService = async ({ directoryId, userId, name }) => {
  const directory = await directoryModel.findOne({
    _id: directoryId,
    userId,
    state: "ACTIVE",
  });

  if (!directory) {
    throw new AppError("Directory not found", 404);
  }

  directory.name = name;
  await directory.save();

  return directory;
};
