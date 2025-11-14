import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";

import userAuthRoutes from "./routes/userAuth.route.js";
import sellerAuthRoutes from "./routes/sellerAuth.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// API Routes
app.use("/api/user/auth", userAuthRoutes);
app.use("/api/seller/auth", sellerAuthRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
