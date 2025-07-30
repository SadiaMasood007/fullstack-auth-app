import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import uploadRoutes from "../routes/upload.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", uploadRoutes);
app.use("/api", authRoutes);
app.get("/", (req, res) => res.send("API root"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
