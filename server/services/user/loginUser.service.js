import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email: email })
    .lean()
    .select("name email password");

  if (!user) {
    throw new AppError("User Not Found", 404);
  }

  if (user.password !== password) {
    throw new AppError("Invalid credentials", 401);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
