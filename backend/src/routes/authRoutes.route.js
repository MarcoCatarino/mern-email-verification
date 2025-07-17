import { Router } from "express";

import {
  signupController,
  verifyEmailController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

const router = Router();

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
