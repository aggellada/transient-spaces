import "dotenv/config";

import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import locationRoutes from "./routes/location.route.js";
import profileRoutes from "./routes/profile.route.js";

import { initDb } from "./lib/db.js";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/profile", profileRoutes);

const startServer = async () => {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Listening on PORT: `, PORT);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();
