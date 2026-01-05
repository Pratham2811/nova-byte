import User from "../../models/UserModel.js";
import { AppError } from "../../utils/AppError.js";
export const getUserService = async (username) => {
  console.log(username);

  const userData = await User.findOne({ name: username })
    .lean()
    .select("name email storageUsed");
  console.log(userData);

  if (!userData) {
    throw new AppError("User Not Found", 404);
  }
  return {
    username: userData.name,
    useremail: userData.email,
  };
};
