import express from "express";
const port = 80;
import cors from "cors";
import directoryroutes from "./routes/directoryroutes.js";
import filesroute from "./routes/filesroute.js";
import trasroutes from "./routes/trashroutes.js";

const app = express();


//parsing request
app.use(express.json());
app.use(cors());


app.use("/directory",directoryroutes);



//files route
app.use("/files",filesroute);



//trash
app.use("/trash",trasroutes);



app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
