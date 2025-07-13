import express from "express";

import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/authRoutes.route.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the Server!");
});

// todo: Middleware
app.use(express.json()); //? -> This allow us to parse incoming requests from : req.body (ex. controllers)

// todo: Routes
app.use("/api/auth", authRoutes);

// todo: Server
app.listen(ENV.PORT || 7002, async () => {
  try {
    console.log(`Listening port: ${ENV.PORT || 7002}`);
    await connectDB();
  } catch (error) {
    console.error({ error: `Error in Server!` });
  }
});
