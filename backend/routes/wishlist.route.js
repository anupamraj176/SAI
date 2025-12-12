import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.get("/", verifyAuth, getWishlist);
router.post("/toggle", verifyAuth, toggleWishlist);

export default router;
