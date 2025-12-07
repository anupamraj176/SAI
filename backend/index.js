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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/ai", aiRoutes); // Add this line

// Middleware to serve static files (images)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
