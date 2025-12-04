import { Product } from "../models/product.model.js"; // Ensure Product model is imported

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Construct image URL (assuming server runs on localhost:5000)
        // In production, this would be a Cloudinary URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const product = new Product({
            seller: req.userId, // Comes from verifyToken middleware
            name,
            description,
            price,
            category,
            stock,
            image: imageUrl
        });

        await product.save();

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error in getSellerProducts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ _id: id, seller: req.userId });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;
        
        let updateData = { name, description, price, category, stock };

        if (req.file) {
             const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
             updateData.image = imageUrl;
        }

        const product = await Product.findOneAndUpdate(
            { _id: id, seller: req.userId },
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Fetch all products, sorted by newest first
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};