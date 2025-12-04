import express from "express";
import { createOrder, getUserOrders, getSellerOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = express.Router();

router.post("/create", verifyAuth, createOrder);
router.get("/my-orders", verifyAuth, getUserOrders); // For Buyers
router.get("/seller-orders", verifyAuth, getSellerOrders); // For Sellers
router.put("/:orderId/status", verifyAuth, updateOrderStatus); // Update Status

export default router;