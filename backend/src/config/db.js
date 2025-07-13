import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log(`Connection Success ✅`);
  } catch (error) {
    console.error({ error: `Connection Error! ❌` });
    process.exit(1);
  }
};
