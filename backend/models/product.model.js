import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //wqCc: Ensure this matches the model name in account.model.js (usually 'User' or 'Account')
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

export const Product = mongoose.model("Product", productSchema);