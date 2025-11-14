import Seller from "../models/seller.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateSellerToken,
  clearSellerToken,
} from "../utils/generateToken.js";

import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailer/mail.js";

export const signup = async (req, res) => {
  const { email, password, shopName } = req.body;

  try {
    if (!email || !password || !shopName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Seller.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Seller already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const seller = new Seller({
      email,
      password: hashedPassword,
      shopName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000,
    });

    await seller.save();

    generateSellerToken(res, seller._id);
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Seller registered. Verify your email.",
      seller: { ...seller._doc, password: undefined },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, seller.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    generateSellerToken(res, seller._id);
    seller.lastLogin = Date.now();
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller logged in",
      seller: { ...seller._doc, password: undefined },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  clearSellerToken(res);
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const seller = await Seller.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!seller)
      return res.status(400).json({ success: false, message: "Invalid or expired code" });

    seller.isVerified = true;
    seller.verificationToken = undefined;
    seller.verificationTokenExpiresAt = undefined;
    await seller.save();

    await sendWelcomeEmail(seller.email, seller.shopName);

    res.status(200).json({
      success: true,
      message: "Seller email verified",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(400).json({ success: false, message: "Seller not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    seller.resetPasswordToken = resetToken;
    seller.resetPasswordExpires = Date.now() + 3600000;
    await seller.save();

    // CORRECT RESET URL
    const resetURL = `${process.env.FRONTEND_URL}/seller/reset-password/${resetToken}`;

    await sendPasswordResetEmail(email, resetURL);

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const seller = await Seller.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!seller)
      return res.status(400).json({ success: false, message: "Invalid or expired token" });

    seller.password = await bcrypt.hash(password, 10);
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpires = undefined;
    await seller.save();

    await sendResetSuccessEmail(seller.email);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select("-password");

    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
