import { basename } from "path";
import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { AuthProvider } from "../../models/AuthProvider.js";

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email: email })
    .lean()
    .select("name email password");

  if (!user) {
    throw new AppError("User Not Found", 404);
  }

  const authProvider = await AuthProvider.findOne({
    userId: user._id,
    provider: "password",
  });

  const isMatch = bcrypt.compare(password, authProvider.passwordHash);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
