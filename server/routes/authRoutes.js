import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { getUserController } from "../controllers/User/getUser.controller.js";
import { loginUserController } from "../controllers/User/loginUser.controller.js";
import { logoutUserController } from "../controllers/User/logoutUser.Controller.js";
import { registerUserController } from "../controllers/User/registerUser.Controller.js";
import { sendOtpController } from "../controllers/auth/send-otp.controller.js";
import { verifyOtpController } from "../controllers/auth/verify-otp.controller.js";

const router = express.Router();
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.get("/me", checkAuth, getUserController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
export default router;
