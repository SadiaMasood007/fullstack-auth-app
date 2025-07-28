// routes/upload.js
import express from "express";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { image } = req.body;

  try {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "user_profiles",
    });
    res.status(200).json({ url: uploadedResponse.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
});

export default router;