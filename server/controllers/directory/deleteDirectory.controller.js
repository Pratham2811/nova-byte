// controllers/directory/deleteDirectory.controller.js
import { deleteDirectoryService } from "../../services/directory/deleteDirectory.service.js";

export const deleteDirectoryController = async (req, res, next) => {
  try {
    
    await deleteDirectoryService(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Directory deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
