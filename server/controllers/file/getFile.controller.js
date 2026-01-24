import path from "node:path";
import fs from "node:fs";
import { getFileService } from "../../services/file/getFile.service.js";

export const getFileController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const action = req.query?.action?.toLowerCase();

    const file = await getFileService({
      fileId: id,
      userId: req.user.id,
    });

    const absolutePath = path.resolve(file.storagePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File missing on disk" });
    }

    if (action === "download") {
      return res.download(
        absolutePath,
        `${file.name}${file.extension}`
      );
    }

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.name}${file.extension}"`
    );

    return res.sendFile(absolutePath);
  } catch (error) {
  res.status(error.statusCode||500).json({
    status:"error",
    messgae:error.message||"Internal Server Error",
    
  })
  }
};
