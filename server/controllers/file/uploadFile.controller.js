import { upload } from "../../middlewares/multer.middleware.js";
import { directoryModel } from "../../models/DirectoryModel.js";
import { uploadFileService } from "../../services/file/uploadFile.service.js";
export const uploadFileController = async (req, res, next) => {
  try {
    let { parentDirId } = req.body || {};

    if (!parentDirId || parentDirId === "undefined" || parentDirId === "null") {
      const rootDirectory = await directoryModel.findOne({
        _id: req.user.rootDirId,
      });

      if (!rootDirectory) {
        return res.status(404).json({
          message: "No root directory found",
        });
      }
      parentDirId = rootDirectory.id;
    }

    const uploadedFiles = req.files;



    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const uploadFile = await uploadFileService(
      uploadedFiles,
      parentDirId,
      req.user.id
    );

    res.status(201).json({
      status: "success",
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Intrnal server Error"
    })

  }
};
