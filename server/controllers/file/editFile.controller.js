import { editFileService } from "../../services/file/editFile.service.js";

export const editFileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newFilename } = req.body;

    if (!newFilename || typeof newFilename !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Invalid file name",
      });
    }

    await editFileService({
      fileId: id,
      userId: req.user.id,
      newFilename: newFilename.trim(),
    });

    return res.status(200).json({
      status: "success",
      message: "File renamed successfully",
    });
  } catch (error) {
    next(error);
  }
};
