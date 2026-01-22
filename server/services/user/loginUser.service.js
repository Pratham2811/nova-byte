import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";
import crypto from "crypto";
import dotenv from "dotenv";
export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email: email })
    .lean()
    .select("name email password");

  if (!user) {
    throw new AppError("User Not Found", 404);
  }
  const hashedPassword = crypto
    .createHmac("sha256",process.env.SECRET_KEY)
    .update(password)
    .digest("base64url");
  if (user.password !== hashedPassword) {
    throw new AppError("Invalid credentials", 401);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
