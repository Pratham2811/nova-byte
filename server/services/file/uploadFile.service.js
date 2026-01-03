import FileModel from "../../models/FileModel.js"

export const uploadFileService=(files,parentDirId,userId)=>{
    
    
    const insertPromises=files.map(async (file)=>{
      const fileObject={
        name:file.originalname,
        storageKey:file.generatedId+file.extension,
        storagePath:file.path,
        extension:file.extension,
        mimeType:file.mimetype,
        size:file.size,
        parentDirId,
        userId,
        state:"ACTIVE",

      }

      const insertFile=await FileModel.insertOne(fileObject);
      console.log(insertFile);
      
     
      
     
    })
}