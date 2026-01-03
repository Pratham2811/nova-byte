import User from "../../models/UserModel.js"
import FileModel from "../../models/FileModel.js";
export const getFileService=async (id)=>{
   console.log(id);
   
    const file=await FileModel.findOne({_id:id});
    
    

}