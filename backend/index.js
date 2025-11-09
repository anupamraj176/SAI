import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Required for reading cookies
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

//  Middlewares
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies from the browser

//  Connect to MongoDB
connectDB();

//  Basic route
app.get("/", (req, res) => {
  res.send("Hello world 123");
});

//  Auth routes
app.use("/api/auth", authRoutes);

//  Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

//  Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
