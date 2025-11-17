export function getDirsCollection(req,res){
     const db=req.db
     if(!db){
      console.log("errinujvbyvt");
      
      return res.status(500).json({
        status:"error",
        message:"Internal Server Error"
      })
     }
     const dirCollection=db.collection('dirs');
     
     
     return dirCollection
}
