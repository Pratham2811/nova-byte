
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
try{
  const client=mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected 🪐🚀");
}catch(error){
  console.log("Error Connecting to thr Database: ",error);
}