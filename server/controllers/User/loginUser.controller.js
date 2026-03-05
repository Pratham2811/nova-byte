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

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }
    const exsistingSessionCount = await Session.countDocuments({
      userId: user.id,
    });
    if (exsistingSessionCount >= 2) {
      return res.status(400).json({
        message: "Device limit reached, Logout from another device to continue",
      });
    }
    const session = await Session.create({
      userId: user.id,
      email:user.email,
    });
    res.cookie("sessionId", user.id, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "none",
    });
   res.send(`
  <script>
    window.opener.postMessage(
      { type: "GOOGLE_AUTH_SUCCESS" },
      "http://localhost:5173"
    );
    window.close();
  </script>
`);
  } catch (error) {
    console.log(error.statusCode, error.message);

    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};
