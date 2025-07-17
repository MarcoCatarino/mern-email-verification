import { Router } from "express";

import {
  checkAuthController,
  signupController,
  verifyEmailController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// ? Check User Token
router.get("/check-auth", verifyToken, checkAuthController);

// ? SignUp Route
router.post("/signup", signupController);

//? Verify Email
router.post("/verify-email", verifyEmailController);

// ? LogIn Route
router.post("/login", loginController);

// ? LogOut Route
router.post("/logout", logoutController);

//? Forget Password
router.post("/forgot-password", forgotPasswordController);

//? Reset Password
router.post("/reset-password/:token", resetPasswordController);

export default router;
