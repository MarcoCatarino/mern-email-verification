import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

import {
  generateTokenAndSetCookie,
  generateVerificationToken,
} from "../utils/generate.utils.js";

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

// todo: Log In Controller
export const loginController = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
  } catch (error) {
    return res.status(400).json({ error: "Error in: " });
  }
};

// todo: Log Out Controller
export const logoutController = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
  } catch (error) {
    return res.status(400).json({ error: "Error in: " });
  }
};
