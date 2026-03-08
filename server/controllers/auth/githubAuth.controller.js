import mongoose from "mongoose";
import { AuthProvider } from "../../models/AuthProvider.js";
import Session from "../../models/Session.js";
import User from "../../models/UserModel.js";
import { getGithubAccessToken } from "../../utils/getGithubAccessToken.js";
import { getGithubUser } from "../../utils/getGithubUserInfo.js";
import { directoryModel } from "../../models/DirectoryModel.js";

export const githubAuthCallbackController = async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect("http://localhost:5173/login");
  }

  const transactionSession = await mongoose.startSession();

  try {
    transactionSession.startTransaction();

    const accessToken = await getGithubAccessToken(code);
    const { id, name, email, avatar_url } = await getGithubUser(accessToken);

    let provider = await AuthProvider.findOne({
      provider: "github",
      providerUserId: id,
    }).session(transactionSession);

    let user;

    if (provider) {
      user = await User.findById(provider.userId).session(transactionSession);
    } else {
      user = await User.findOne({ email }).session(transactionSession);

      if (user) {
        await AuthProvider.create(
          [
            {
              userId: user._id,
              provider: "github",
              providerUserId: id,
              providerEmail: email,
            },
          ],
          { session: transactionSession },
        );
      } else {
        const userId = new mongoose.Types.ObjectId();
        const rootDirId = new mongoose.Types.ObjectId();

        await directoryModel.create(
          [
            {
              _id: rootDirId,
              name: `root-${email}`,
              parentDirId: null,
              userId,
            },
          ],
          { session: transactionSession },
        );

        const [newUser] = await User.create(
          [
            {
              _id: userId,
              name,
              email,
              email_verified: true,
              rootDirId,
              avatarUrl: avatar_url,
              storage: 0,
              state: "ACTIVE",
            },
          ],
          { session: transactionSession },
        );

        user = newUser;

        await AuthProvider.create(
          [
            {
              userId: user._id,
              provider: "github",
              providerUserId: id,
              providerEmail: email,
            },
          ],
          { session: transactionSession },
        );
      }
    }

    const sessionCount = await Session.countDocuments({
      userId: user._id,
    }).session(transactionSession);

    if (sessionCount >= 2) {
      throw new Error(
        "Device limit reached. Logout from another device to continue.",
      );
    }

    const [sessionDoc] = await Session.create(
      [
        {
          userId: user._id,
          email: user.email,
        },
      ],
      { session: transactionSession },
    );

    await transactionSession.commitTransaction();

    res.cookie("sessionId",user.id, {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.redirect("http://localhost:5173/");
  } catch (error) {
    await transactionSession.abortTransaction();
   return res.redirect("http://localhost:5173/login");
  } finally {
    transactionSession.endSession();
  }
};
