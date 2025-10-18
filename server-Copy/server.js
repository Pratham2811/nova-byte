import express from "express";
const port = 80;
import cors from "cors";
import directoryroutes from "./routes/directoryroutes.js";
import filesroute from "./routes/filesroute.js";
import trasroutes from "./routes/trashroutes.js";
import { error } from "console";
import userRoutes from "./routes/userRoutes.js"
const app = express();


//parsing request
app.use(express.json());
app.use(cors());


app.use("/directory",directoryroutes);
//files route
app.use("/file",filesroute);
app.use("/user",userRoutes)


//trash
app.use("/trash",trasroutes);

app.use((error,req,res,next)=>{
  console.log("Error come");
  console.log(error);
  
  res.status(error.status||500).json({message:"Internal server Error"})
  
})

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
