import express from "express";
import { 
    addProduct, 
    getSellerProducts, 
    deleteProduct, 
    updateProduct, 
    getAllProducts // Import the new function
} from "../controllers/product.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Route to get ALL products for the marketplace
router.get("/all", getAllProducts); 

router.post("/add", verifyAuth, upload.single("image"), addProduct);
router.get("/my-products", verifyAuth, getSellerProducts);
router.put("/:id", verifyAuth, upload.single("image"), updateProduct);
router.delete("/:id", verifyAuth, deleteProduct);

export default router;