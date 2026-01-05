// controllers/directory/updateDirectory.controller.js
import { updateDirectoryService } from "../../services/directory/updateDirectory.service.js";

export const updateDirectoryController = async (req, res, next) => {
  try {
    const directory = await updateDirectoryService({
      directoryId: req.params.id,
      userId: req.user.id,
      name: req.body.newName,
    });

    res.status(200).json({
      status: "success",
      data: directory,
    });
  } catch (error) {
    next(error);
  }
};
