import mongoose from "mongoose";
import User from "../models/UserModel.js";
import { mapMongoId } from "../utils/mapMongoId.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { log } from "console";
import Session from "../models/Session.js";
dotenv.config();
export default async function checkAuth(req, res, next) {
  try {
    const { sessionId } = req.signedCookies;
    if (!sessionId) {
      return res.status(401).json({
        error: "Not logged in",
        status: 401,
      });
    }
    const session = await Session.findOne({ userId: sessionId });
    if (!session) {
      res.clearCookie("sessionId");
      return res.status(401).json({
        error: "session is expired, Login again to continue",
        status: 401,
      });
    }
    // 2. ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(401).json({ error: "Invalid user session" });
    }

    // 3. DB lookup
    const userDoc = await User.findById(sessionId).lean();

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
