import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { getToken } from "google-auth-library/build/src/gtoken/getToken.js";
import Session from "../../models/Session.js";
import User from "../../models/UserModel.js";
import mongoose from "mongoose";
import { directoryModel } from "../../models/DirectoryModel.js";
import { AuthProvider } from "../../models/AuthProvider.js";
dotenv.config();
const client = new OAuth2Client({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});
export async function googleAuthController(req, res) {
  try {
    const { sessionId } = req.signedCookies;
    console.log(sessionId);
    if (sessionId) {
      return res.status(409).json({
        success: false,
        message: "User Already Logged In",
      });
    }

    const authURL = client.generateAuthUrl({
      scope: ["profile", "openid", "email"],
      // prompt: "consent",
      // access_type:"offline"
    });
    res.status(200).json({
      success: true,
      data: authURL,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function googleAuthCallbackController(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect("http://localhost:5173/login");
    }
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified",
      });
    }

    const { sub, email, name, picture } = payload;

    let provider = await AuthProvider.findOne({
      provider: "google",
      providerUserId: sub,
    });

    let user;

    if (provider) {
      user = await User.findById(provider.userId);
    } else {
      user = await User.findOne({ email });

      if (user) {
        provider = await AuthProvider.create({
          userId: user._id,
          provider: "google",
          providerUserId: sub,
          providerEmail: email,
        });
      } else {
        const userId = new mongoose.Types.ObjectId();
        const rootDirId = new mongoose.Types.ObjectId();

        await directoryModel.create({
          _id: rootDirId,
          name: `root-${email}`,
          parentDirId: null,
          userId,
        });

        user = await User.create({
          _id: userId,
          name,
          email,
          email_verified: true,
          rootDirId,
          avatarUrl: picture,
          storage: 0,
          state: "ACTIVE",
        });

        provider = await AuthProvider.create({
          userId: user._id,
          provider: "google",
          providerUserId: sub,
          providerEmail: email,
        });
      }
    }

    const sessionCount = await Session.countDocuments({
      userId: user._id,
    });

    if (sessionCount >= 2) {
      return res.status(400).json({
        success: false,
        message:
          "Device limit reached. Logout from another device to continue.",
      });
    }

    const session = await Session.create({
      userId: user._id,
      email: user.email,
    });

    res.cookie("sessionId", user._id.toString(), {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });
    return res.redirect(`http://localhost:5173/`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
