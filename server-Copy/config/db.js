import { MongoClient } from "mongodb";
 export const client = new MongoClient("mongodb://127.0.0.1:27017/StorageApp");


// console.log(connectFlag);
let db;
export async function connectDB() {
try{
   
    
    
  const connectFlag = await client.connect();
  
  
  console.log("🔥 MongoDB connected");
   db = client.db();
 return db
}catch(error){
  
     console.log("Errororororoororor");
     
}
}


