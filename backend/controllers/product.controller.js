import {Product} from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (req, res) => {
    try {
        console.log("Creating product...", req.body);
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        let imageUrl = "";

        if (req.files && req.files.image) {
            const file = req.files.image;
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "SAI/Products",
                resource_type: "image"
            });
            imageUrl = result.secure_url;
        }

        const product = new Product({
            seller: req.user.userId, // Uses the fixed verifyAuth middleware
            name,
            description,
            price,
            category,
            image: imageUrl,
            stock
        });

        await product.save();
        console.log("Product saved:", product);

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.userId });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        console.log("Fetching ALL products for marketplace...");
        const products = await Product.find({});
        console.log(`Found ${products.length} products in DB.`);
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let updateData = { name, description, price, category, stock };

        if (req.files && req.files.image) {
             const file = req.files.image;
             const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "SAI/Products"
            });
            updateData.image = result.secure_url;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, message: "Product updated", product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};