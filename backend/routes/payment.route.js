import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/checkout", verifyAuth, createCheckoutSession);

export default router;
