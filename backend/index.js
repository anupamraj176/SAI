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
import paymentRoutes from "./routes/payment.route.js";
import { handleStripeWebhook } from "./controllers/payment.controller.js";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Define robust __dirname under ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & Compression Middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Allow leaflet map tiles and cloudinary assets
}));
app.use(compression());

// Auth Rate Limiting to prevent brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. Connect Cloudinary
cloudinaryConnect();

const defaultOrigins = ["http://localhost:5173", "https://sai-8zrg.onrender.com"];
const envOrigins = process.env.CORS_ORIGINS || process.env.CLIENT_URL;
const isProd = process.env.NODE_ENV === "production";
let allowedOrigins = envOrigins
    ? envOrigins.split(",").map((origin) => origin.trim()).filter(Boolean)
    : (isProd ? defaultOrigins : true);

if (Array.isArray(allowedOrigins)) {
    if (allowedOrigins.includes("*")) {
        allowedOrigins = true;
    } else {
        // Ensure default origins are included
        if (isProd && !allowedOrigins.includes("https://sai-8zrg.onrender.com")) {
            allowedOrigins.push("https://sai-8zrg.onrender.com");
        }
        if (!allowedOrigins.includes("http://localhost:5173")) {
            allowedOrigins.push("http://localhost:5173");
        }
    }
}

app.use(cors({
    origin: allowedOrigins === true
        ? true
        : (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Return false instead of throwing an Error to avoid Express 500 crashes
            return callback(null, false);
        },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json());
app.use(cookieParser()); 

// FIX: Use absolute path for temp files and create parent path
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'), // Saves to d:\SAI\backend\tmp
    createParentPath: true, // Creates folder if missing
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

// Health check endpoints for Render keep-alive and monitoring
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Server is healthy and running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
