import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";

export const generateVerificationToken = () => {
  Math.floor(10000 + Math.random() * 900000).toString();
};

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true, //Prevents JS querys and only validate http request (XSS Attacks)
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict", //Prevent CSRF Attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, //Time of each cookie
  });

  return token;
};
