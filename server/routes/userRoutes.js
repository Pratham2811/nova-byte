import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { getUserController } from "../controllers/User/getUser.controller.js";
import { loginUserController } from "../controllers/User/loginUser.controller.js";
import { logoutUserController } from "../controllers/User/logoutUser.Controller.js";
import { registerUserController } from "../controllers/User/registerUser.Controller.js";
const router = express.Router();

router.post("/create-user",registerUserController);
router.post("/login-user", loginUserController);
router.post("/logout-user",logoutUserController);
router.get("/", checkAuth,getUserController);
export default router;
