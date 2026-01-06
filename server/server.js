import express from "express";
const port = 80;
import cors from "cors";
import directoryroutes from "./routes/directoryroutes.js";
import filesroute from "./routes/filesroute.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import checkAuth from "./middlewares/authMiddleware.js";
import "./config/db.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
try{
  //parsing request
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use("/directory", checkAuth, directoryroutes);
  app.use("/file", checkAuth, filesroute);
  app.use("/user", userRoutes);

 

  app.use((error, req, res, next) => {

   if (error.code === 121) {
    // This will print the FULL validation error details
    console.dir(error.errInfo, { depth: null, colors: true })}
    console.log(error);

    res.status(error.status || 500).json({
      status: "error",
      message: error.message || "Internal server Error",
    });
  });

  app.listen(port, () => {
    console.log(`server is listening on ${port}`);
  });
}catch (error) {
  console.log("Error while connecting to DB: ", error);
}
