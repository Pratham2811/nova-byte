import { loginUserService } from "../../services/user/loginUser.service.js";
import crypto from "crypto";
import dotenv from "dotenv";
import Session from "../../models/Session.js";
dotenv.config();
export const loginUserController = async (req, res, next) => {
  try {
    const { userId } = req.cookies;

    const { email, password } = req.body;

    const user = await loginUserService(email, password);
    // const cookiePayload = {
    //   expiry: Math.round(Date.now() / 1000 + 86400).toString(16),
    //   userId: user.id,
    // };

    if (!user) {
    return res.status(404).json({
      status:"error",
      message:"user not found"
    })
    }
    const session=await Session.create({
      userId:user.id,
    });
  res.cookie("sessionId", user.id, {
        httpOnly: true,
        secure: true,
        signed:true,
        sameSite: "none",
      });
    return res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.log(error.statusCode, error.message);

    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};
