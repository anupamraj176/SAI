import express from "express";
import { getCropAdvice } from "../controllers/ai.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/ask", verifyAuth, getCropAdvice);

export default router;