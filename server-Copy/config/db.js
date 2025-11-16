import { MongoClient } from "mongodb";



// console.log(connectFlag);
let db;
export async function connectDB() {
try{
    const client = new MongoClient("mongodb://127.0.0.1:27017/StorageApp");
    
    
  const connectFlag = await client.connect();
  
  
  console.log("🔥 MongoDB connected");
   db = client.db();
 return db
}catch(error){
  
     console.log("Errororororoororor");
     
}
}


