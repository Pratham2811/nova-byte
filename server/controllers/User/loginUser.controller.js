import { loginUserService } from "../../services/user/loginUser.service.js";
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config();
export const loginUserController = async (req, res, next) => {
  try {
    const { userId } = req.cookies;

    const { email, password } = req.body;

    const user = await loginUserService(email, password);
    const cookiePayload={
      expiry: Math.round(Date.now() / 1000 + 86400).toString(16),
      userId:user.id,
    };
    const bufferCookiePayload=JSON.stringify(cookiePayload)
    const signature=crypto.createHash("sha256").update(bufferCookiePayload).update(process.env.SECRET_KEY).digest("base64url");
    const signedCookie=`${Buffer.from(bufferCookiePayload).toString("base64url")}.${signature}`;
    
    
    if (user) {
      res.cookie(
        "token",
        signedCookie,
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
