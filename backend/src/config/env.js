import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  CLIENT_URI: process.env.CLIENT_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  MAILTRAP_ENDPOINT: process.env.MAILTRAP_ENDPOINT,
  MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
};
