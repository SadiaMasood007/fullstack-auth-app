// /api/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import uploadRoutes from "../routes/upload.js";
import serverless from "serverless-http"; 
// Load .env
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_ORIGIN],
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
// export default function handler(req, res) {
//   res.status(200).json({ message: "Hello from Vercel!" });
// }

export default serverless(app);