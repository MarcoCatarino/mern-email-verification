import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No Token Provided" });

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token Provided" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken: ", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
