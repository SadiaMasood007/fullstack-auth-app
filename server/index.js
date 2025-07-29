import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";


dotenv.config();
const app = express();

app.use(cors({ origin: ["http://localhost:5173", "https://authenticate-app-front.netlify.app"],

credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/api", uploadRoutes);


app.use("/api", authRoutes);
app.get("/", (req, res) => res.send("Server running"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on ${process.env.PORT || 5000}`)
);
