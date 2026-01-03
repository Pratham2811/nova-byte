import { getFileService } from "../../services/file/getFile.service.js";
export const getFileController=(req,res,next)=>{
 const {id}=req.params;
 console.log(id);
 
    try{
   const file=getFileService(id)
    }catch(error){
        console.log(error);
        
    }
}