import { Router } from "express";

import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller.js";

const router = Router();

// ? SignUp Route
router.post("/signup", signupController);

// ? LogIn Route
router.post("/login", loginController);

// ? LogOut Route
router.post("/logout", logoutController);

export default router;
