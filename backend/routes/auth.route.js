import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/check-auth", verifyAuth, checkAuth);
router.put("/profile", verifyAuth, updateProfile);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;