import express from "express";
import { googleAuthCallbackController } from "../controllers/auth/googleAuth.controller.js";
import {
  googleDriveIntegrationCallbackController,
  googleDriveIntegrationController,
} from "../controllers/integration/googleDriveIntegration.controller.js";
import checkAuth from "../middlewares/authMiddleware.js";
import { getIntegrations } from "../controllers/integration/getIntegrationsInfo.controller.js";

const router = express.Router();

router.post(
  "/google-drive/connect",
  checkAuth,
  googleDriveIntegrationController,
);
router.get(
  "/google-drive/callback",
  checkAuth,
  googleDriveIntegrationCallbackController,
);
router.get("/all", checkAuth, getIntegrations);
export default router;
