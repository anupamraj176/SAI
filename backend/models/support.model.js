import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: false }, // Optional, for guests
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        default: "Open", 
        enum: ["Open", "In Progress", "Resolved", "Closed"] 
    }
}, { timestamps: true });

export const Support = mongoose.model("Support", supportSchema);