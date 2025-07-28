import express from "express";
import jwt from "jsonwebtoken";
import { signup, login, googleOAuthLogin, googleOAuthSignup, getUsers, getMyProfile, updateMyProfile ,authenticate} from "../controllers/authController.js";


const router = express.Router();

const genToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


router.post("/signup", signup);
router.post("/login", login);
router.post("/oauth/google-login", googleOAuthLogin);
router.post("/oauth/google-signup", googleOAuthSignup);
router.get("/users", authenticate, getUsers);
router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);


export default router;
