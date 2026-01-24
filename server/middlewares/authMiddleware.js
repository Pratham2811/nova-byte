import mongoose from "mongoose";
import User from "../models/UserModel.js";
import { mapMongoId } from "../utils/mapMongoId.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();
export default async function checkAuth(req, res, next) {
  try {
    const { token } = req.signedCookies;
     if (!token) {
      return res.status(401).json({
        error: "Not logged in",
        status: 401,
      });
    }
const signedToken=Buffer.from(token,"base64url").toString();
const {expiry,userId}=JSON.parse(signedToken);

const currentTIme=Math.round(Date.now()/1000).toString(16)

if(currentTIme>expiry){
   res.clearCookie();
   return res.status(401).json({
    message:"Logged Out"
   })
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
