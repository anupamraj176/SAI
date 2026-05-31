import express from "express";
import { createCheckoutSession, verifyRazorpayPayment } from "../controllers/payment.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/checkout", verifyAuth, createCheckoutSession);
router.post("/razorpay/verify", verifyAuth, verifyRazorpayPayment);

export default router;
