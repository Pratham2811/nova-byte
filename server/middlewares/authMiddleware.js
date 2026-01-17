import mongoose from "mongoose";
import User from "../models/UserModel.js";
import { mapMongoId } from "../utils/mapMongoId.js";

export default async function checkAuth(req, res, next) {
  try {
   
    
    const { cookieuserId } = req.cookies;
    // 1. Presence check

    if (!cookieuserId) {
      return res.status(401).json({ 
        error: "Not logged in",
        status:401

       });
    }
 const{expiry,userId}=JSON.parse(Buffer.from(cookieuserId,"base64").toString("utf-8"));
const currentTime=Math.round((Date.now()/1000));
const expireyTime=parseInt(expiry,16);
if(currentTime>expireyTime){
  return res.clearCookie("cookieuserId").status(401).json({ 
    error: "Session expired",
    status:401

   });
}

 
    // 2. ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid user session" });
    }

    // 3. DB lookup
    const userDoc = await User.findById(userId).lean();


    if (!userDoc) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4. Normalize AFTER existence check
    req.user = mapMongoId(userDoc);

    next();
  } catch (err) {
    next(err); // delegate to global error handler
  }
}
