
import { getDirectoryService } from "../../services/directory/getDirectory.service.js";

export const getDirectoryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await getDirectoryService(id, req.user.id);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
