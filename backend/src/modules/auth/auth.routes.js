import { Router } from "express";
import * as authController from "./auth.controller.js";
import { protect } from "../../middleware/auth.js";

const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/verify-invite", authController.verifyInvite);
router.get("/me", protect, authController.me);

export default router;
