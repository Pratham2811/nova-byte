import mongoose from "mongoose";
import User from "../models/UserModel.js";
import { mapMongoId } from "../utils/mapMongoId.js";

export default async function checkAuth(req, res, next) {
  try {
    const { userId } = req.cookies;

    // 1. Presence check


    if (!userId) {
      return res.status(401).json({ 
        error: "Not logged in",
        status:401

       });
    }
 const id=userId.substr(0,24)
 const expiryTime=parseInt(userId.substr(24,32));
 const currentTime=Date.now()/1000
 console.log(currentTime-expiryTime);
 
    // 2. ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({ error: "Invalid user session" });
    }

    // 3. DB lookup
    const userDoc = await User.findById(id).lean();


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
