import express from "express";
import { 
  getDashboardStats, 
  getAllUsers, 
  deleteUser, 
  getAllSellers, 
  verifySeller, 
  deleteSeller,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Apply middleware to all routes
router.use(verifyAuth, verifyAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Sellers
router.get("/sellers", getAllSellers);
router.put("/sellers/:id/verify", verifySeller);
router.delete("/sellers/:id", deleteSeller);

// Products
router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;
