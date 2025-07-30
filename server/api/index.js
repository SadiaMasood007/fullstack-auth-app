// /index.js or /server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
