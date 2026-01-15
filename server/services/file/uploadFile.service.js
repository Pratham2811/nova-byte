import FileModel from "../../models/FileModel.js";

export const uploadFileService = (files, parentDirId, userId) => {

 
  
  return Promise.all(
    files.map(async (file) => {
      const fileObject = {
        _id: file.generatedId,
        name: file.originalname,
        storageKey: file.generatedId + file.extension,
        storagePath: `./storage2/${file.generatedId+file.extension}`,
        extension: file.extension,
        mimeType: file.mimetype,
        size: file.size,
        parentDirId,
        userId,
        state: "ACTIVE",
        deletedAt: null,
        trashedAt: null,
      };

      return await FileModel.insertOne(fileObject);
    })
  );
};
