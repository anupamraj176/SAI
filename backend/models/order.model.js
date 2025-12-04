import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        default: "Pending", 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] 
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);