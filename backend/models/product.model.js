import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String, // We will store the URL/path to the image
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);