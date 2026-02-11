import { registerUserService } from "../../services/user/registerUser.service.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "User not created. Error: Missing data.",
      });
    }

    const result = await registerUserService(username, email, password);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
