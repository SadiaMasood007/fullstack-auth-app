// /api/index.js
import express from "express";
// import { createServer } from "@vercel/node";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import uploadRoutes from "../routes/upload.js";

// Load .env
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://authenticate-app-front.netlify.app"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.get("/api", (req, res) => res.send("API root"));

// 👇 Export as Vercel-compatible handler
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from Vercel!" });
}

