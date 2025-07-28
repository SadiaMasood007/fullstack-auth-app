import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const signup = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { email, password, name, gender, age } = req.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "Email already in use" });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      let imageUrl = null;
      if (req.file) {
        imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
      }

      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword, 
          name,
          gender,
          age: parseInt(age),
          image: imageUrl,
        },
      });

      return res.status(200).json({ message: "Signup successful" });
    } catch (err) {
      console.error("Signup Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Password from login:", password);
console.log("Password from DB:", user.password);

   
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d", 
    });

  
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleOAuthSignup = async (req, res) => {
  try {
    const { token: googleToken, name, age, gender } = req.body;
    console.log("Google signup body:", req.body);

    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
    const info = await resp.json();

    const email = info.email;
    const oauthId = info.sub;
    if (!email) throw new Error("No email from Google");

    
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Account already exists. Try logging in." });
    }

   
    const user = await prisma.user.create({
      data: {
        email,
        name: name || info.name || "",
        image: info.picture || null, 
        oauthProvider: "google",
        oauthId,
        password: null,
        age: age ? parseInt(age) : 0,
        gender: gender || "Not Specified",
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user });
  } catch (e) {
    console.error("Google Signup Error:", e);
    res.status(500).json({ message: e.message || "Internal server error" });
  }
};

export const googleOAuthLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
    const info = await resp.json();

    const email = info.email;
    if (!email) throw new Error("No email from Google");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "No account found. Please sign up with Google first." });
    }

    if (user.oauthProvider !== "google") {
      return res.status(400).json({ message: "This account was not created using Google login." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, gender: true, age: true, image: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, gender: true, age: true, image: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


export const updateMyProfile = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, gender, age } = req.body;
      let imageUrl;

      if (req.file) {
        imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: {
          name,
          gender,
          age: age ? parseInt(age) : undefined,
          ...(imageUrl && { image: imageUrl }),
        },
        select: { id: true, name: true, email: true, gender: true, age: true, image: true },
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  },
];
