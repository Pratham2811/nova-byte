import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGO_URI);

 export const client = new MongoClient(process.env.MONGO_URI)
let db;
export async function connectDB() {
try{
   
  
    
    
  const connectFlag = await client.connect();

  
  
  console.log("🔥 MongoDB connected");
   db = client.db();
 return db
}catch(error){
  console.log(error);
  
     console.log("Errororororoororor");
     
}
}
 export async function getClient() {
  return client;
  
}


