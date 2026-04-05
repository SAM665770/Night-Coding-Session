import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database-config.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import userRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import aiRoutes from "./routes/ai-route.js";
app.use("/api/auth", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

connectDB().then(() => {
  console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
  app.listen(3000, () => {
    console.log(`Listening on http://localhost:3000`);
  });
});
