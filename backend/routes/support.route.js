import express from "express";
import { createSupportTicket } from "../controllers/support.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

// Allow both authenticated and unauthenticated users to submit support tickets
// We use a wrapper to check for auth but not enforce it strictly if you want public access, 
// but for dashboards, we usually have verifyAuth. 
// Let's make it flexible: if token exists, use it, otherwise just save data.
// For this specific dashboard implementation, we will use verifyAuth.

router.post("/create", verifyAuth, createSupportTicket);

export default router;