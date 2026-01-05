// services/directory/createDirectory.service.js
import { directoryModel } from "../../models/DirectoryModel.js";
import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";

export const createDirectoryService = async ({ name, parentDirId, userId }) => {
  const user = await User.findById(userId).lean().select("rootDirId");

  if (!user) {
    throw new AppError("Unauthorized access", 401);
  }

  const resolvedParentDirId = parentDirId || user.rootDirId;

  if (!resolvedParentDirId) {
    throw new AppError("Parent directory not found", 400);
  }

  const directory = await directoryModel.create({
    name: name?.trim() || "New Folder",
    parentDirId: resolvedParentDirId,
    userId,
  });

  return directory;
};
