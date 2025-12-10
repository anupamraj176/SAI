import express from "express";
import { 
    createProduct, // Changed from addProduct to createProduct
    getSellerProducts, 
    getAllProducts, 
    deleteProduct, 
    updateProduct 
} from "../controllers/product.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js"; // Ensure you import your auth middleware

const router = express.Router();

// Route to create a product (Protected)
router.post("/create", verifyAuth, createProduct);

// Route to get logged-in seller's products (Protected)
router.get("/my-products", verifyAuth, getSellerProducts);

// Route to get all products (Public)
router.get("/", getAllProducts);

// Route to delete a product (Protected)
router.delete("/:id", verifyAuth, deleteProduct);

export default router;