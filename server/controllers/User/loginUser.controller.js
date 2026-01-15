import { loginUserService } from "../../services/user/loginUser.service.js";

export const loginUserController = async (req, res, next) => {
  try {
    const { userId } = req.cookies;

    const { email, password } = req.body;

    const user = await loginUserService(email, password);

    if (user) {
      res.cookie(
        "userId",
        `${user.id + Math.round(Date.now() / 1000 + 40).toString(16)}`,
        {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        }
      );
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error.statusCode, error.message);

    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};
