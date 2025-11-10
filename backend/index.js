import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// API Routes
app.use("/api/auth", authRoutes);

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
  
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
