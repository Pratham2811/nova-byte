// controllers/directory/createDirectory.controller.js
import { createDirectoryService } from "../../services/directory/createDirectory.service.js";
import { mapMongoId } from "../../utils/mapMongoId.js";

export const createDirectoryController = async (req, res, next) => {
  try {
    const directory = await createDirectoryService({
      name: req.body.directoryname, 
      parentDirId: req.body.parentDirId,
      userId: req.user.id,
    });

    res.status(201).json({
      status: "success",
      message: "Folder created successfully",
      data: mapMongoId(directory.toObject()),
    });
  } catch (error) {
    next(error);
  }
};
