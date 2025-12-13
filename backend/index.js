import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import supportRoutes from "./routes/support.route.js";
import aiRoutes from "./routes/ai.route.js";
import path from "path";
import fileUpload from "express-fileupload";
import { cloudinaryConnect } from "./config/cloudinary.js";
import uploadRoutes from "./routes/upload.route.js"; 
import wishlistRoutes from "./routes/wishlist.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); // Define __dirname

// 2. Connect Cloudinary
cloudinaryConnect();

app.use(cors({
    origin: ["http://localhost:5173", "https://sai-8zrg.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser()); 

// FIX: Use absolute path for temp files and create parent path
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'), // Saves to d:\SAI\backend\tmp
    createParentPath: true, // Creates folder if missing
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
