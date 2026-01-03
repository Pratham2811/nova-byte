import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { getUsersCollection } from "../config/userCollection.js";
import { getDirsCollection } from "../config/dirCollection.js";
import { normalizeDoc } from "../utils/apiDataFormat.js";
import { ObjectId } from "mongodb";
import { transactionProvide } from "../utils/transaction.js";
import { getUserController } from "../controllers/User/getUser.controller.js";
import { loginUserController } from "../controllers/User/loginUser.controller.js";
import { logoutUserController } from "../controllers/User/logoutUser.Controller.js";
const router = express.Router();

router.post("/create-user", async (req, res) => {
  const body = req.body || {};
  const { username, email, password } = body;
  console.log();

  if (!username || !email || !password) {
    console.log("Error in UserData");
    return res
      .status(400)
      .json({ message: "User not created. Error: Missing data." });
  }
  const userCollection = getUsersCollection(req);
  const dirsCollection = getDirsCollection(req);
  const RedundantEmail = await userCollection.findOne(
    { email: email },
    { unique: true }
  );

  if (RedundantEmail) {
    return res
      .status(409)
      .json({ message: "User Already Registered with Same email" });
  }

  //find if email is exists in DB

  const userId = new ObjectId();
  const rootDirId = new ObjectId();
  try {
    await transactionProvide(async (session) => {
      const dirData = {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId: userId,
        deleted: false,

        createdAt: new Date(),
      };

      const userData = {
        _id: userId,
        username,
        email,
        password,
        rootDirId: rootDirId,
        storageUsed: 0,
        createdAt: new Date(),
      };

      const dirInsertion = await dirsCollection.insertOne(dirData, { session });
      const userInsertion = await userCollection.insertOne(userData, {
        session,
      });
    });
    res.status(201).json({ message: "User created Sucessfully" });
  } catch (error) {
    if (error.code == 121) {
      res.status(400).json({
        status: "error",
        message: "Invalid input,Please Enter valid Detail ",
      });
    } else {
      console.log(error);

      res.status(500).json({
        status: "error",
        message: "Error Creating User",
      });
    }
  }
});

router.post("/login-user", loginUserController);

router.post("/logout-user",logoutUserController);

router.get("/", checkAuth,getUserController);
export default router;
