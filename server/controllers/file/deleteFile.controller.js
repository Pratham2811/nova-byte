import { deleteFileService } from "../../services/file/deleteFile.service.js";


export const deleteFileController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFile = await deleteFileService({
      fileId: id,
      userId: req.user.id,
    });

    return res.status(200).json({
      status: "success",
      message: "File deleted SucessFully",
    });
  } catch (error) {
    next(error);
  }
};
