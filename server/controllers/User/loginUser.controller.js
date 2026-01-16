import { loginUserService } from "../../services/user/loginUser.service.js";

export const loginUserController = async (req, res, next) => {
  try {
    const { userId } = req.cookies;

    const { email, password } = req.body;

    const user = await loginUserService(email, password);
    const cookiePayload={
      expiry: Math.round(Date.now() / 1000 + 40).toString(16),
      userId:user.id,
    }
    if (user) {
      res.cookie(
        "cookieuserId",
        `${Buffer.from(JSON.stringify(cookiePayload)).toString("base64")}`,
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
