import bcrypt from "bcryptjs";
import crypto from "crypto";

import { ENV } from "../config/env.js";

import { User } from "../models/user.model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

import {
  generateTokenAndSetCookie,
  generateVerificationToken,
} from "../utils/generate.utils.js";

// todo: Check Auth Controller
export const checkAuthController = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// todo: Sign Up Controller
export const signupController = async (req, res) => {
  try {
    //* Return data from body
    const { email, password, name } = req.body;

    //* Verify all fields have content
    if (!email || !password || !name)
      throw new Error("All fields are required");

    //* Verify if User already exist
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist)
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });

    //* Hash the Password and Generate a Token that expires
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    //* Format the new user with all the required data and it's new props (hashed, token, token expire)
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 100, //<- This give 24 hours to expire the token
    });

    //* Create the new user in DB
    await user.save();

    //* JWT
    generateTokenAndSetCookie(res, user._id);

    //* Send Verification code by email
    await sendVerificationEmail(user.email, verificationToken);

    //* Return Success (without Password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// todo: Verify Email Controller
export const verifyEmailController = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired Verification Code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email Verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(`There was an error verifying the email: ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Error verifying email",
    });
  }
};

// todo: Log In Controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in Log In", error);
    return res.status(400).json({ success: false, message: "Error in Log In" });
  }
};

// todo: Log Out Controller
export const logoutController = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged Out Successfully" });
};

// todo: Forgot Password Controller (reset password)
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });

    //* Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hr

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //* Send Email
    await sendResetPasswordEmail(
      user.email,
      `${ENV.CLIENT_URI}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password rest link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgot password ", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// todo: Reset Password Controller (reset password)
export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired  Reset Token" });

    //* Update Password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    //* Send Success Reset Password\
    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    console.log("Error in reset password ", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
