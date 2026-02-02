import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { getUserController } from "../controllers/User/getUser.controller.js";
import { loginUserController } from "../controllers/User/loginUser.controller.js";
import { logoutUserController } from "../controllers/User/logoutUser.Controller.js";
import { registerUserController } from "../controllers/User/registerUser.Controller.js";
const router = express.Router();

router.post("/register",registerUserController);
router.post("/login", loginUserController);
router.post("/logout",logoutUserController);
router.get("/me", checkAuth,getUserController);
export default router;
