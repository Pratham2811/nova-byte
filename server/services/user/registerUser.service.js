import mongoose from "mongoose";
import { directoryModel } from "../../models/DirectoryModel.js";
import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export const registerUserService = async (username, email, password) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({ email })
      .select("name")
      .session(session);

    if (existingUser) {
      throw new AppError("User already registered", 409);
    }

    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();
    const hashedPassword = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(password)
      .digest("base64url");

    await directoryModel.create(
      [
        {
          _id: rootDirId,
          name: `root-${email}`,
          parentDirId: null,
          userId,
        },
      ],
      { session },
    );

    await User.create(
      [
        {
          _id: userId,
          name: username,
          email,
          password: hashedPassword,
          rootDirId,
          storage: 0,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return { userId, rootDirId };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
