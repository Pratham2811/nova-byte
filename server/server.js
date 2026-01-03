import express from "express";
const port = 80;
import cors from "cors";
import directoryroutes from "./routes/directoryroutes.js";
import filesroute from "./routes/filesroute.js";
import trasroutes from "./routes/trashroutes.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser"
import checkAuth from "./middlewares/authMiddleware.js";
import  "./config/db.js";
import dotenv from "dotenv";
import { connectDB, getClient } from "./config/db.js";

dotenv.config()
const app = express();

const db=await connectDB()
const client=getClient()
try{
 
// //to make available sb for every roite we are sticke db to request 
app.use((req,res,next)=>{

  
  req.db=db;
  next();
})

//parsing request
app.use(express.json());
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true,

  })

);
app.use(cookieParser())

app.use("/directory",checkAuth,directoryroutes);
//files route
app.use("/file",checkAuth,filesroute);
app.use("/user",userRoutes)


// //trash
// app.use("/trash",checkAuth,trasroutes);

app.use((error,req,res,next)=>{
  console.log("Error come");
  console.log(error);
  
  res.status(error.status||500).json({message:"Internal server Error"})
  
})

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
})}catch(error){
  
  console.log("Error while connecting to DB: ",error);

}
