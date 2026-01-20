import { directoryModel } from "../../models/DirectoryModel.js";
import FileModel from "../../models/FileModel.js";
import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";
import { mapMongoId } from "../../utils/mapMongoId.js";

export const getDirectoryService = async (directoryId, userId) => {
 
  
  if (!directoryId) {
    const user = await User.findById(userId).lean().select("rootDirId");

    if (!user || !user.rootDirId) {
      throw new AppError("Root directory not found for user", 404);
    }

    directoryId = user.rootDirId;
  }

  const directory = await directoryModel
    .findOne({
      _id: directoryId,
      userId,
    })
    .lean()
    .select("name parentDirId userId createdAt updatedAt");

  if (!directory) {
    throw new AppError("Directory not found", 404);
  }


  const files = await FileModel.find({
    parentDirId: directory._id,
    userId,
    state: "ACTIVE",
  })
    .lean()
    .select("name size mimeType createdAt extension");


  const directories = await directoryModel
    .find({
      parentDirId: directory._id,
      userId,
      state: "ACTIVE",
    })
    .lean()
    .select("name createdAt");
 
 
  return {
    directory: mapMongoId(directory),
    files: files.map(mapMongoId),
    directories: directories.map(mapMongoId),
  };
};
