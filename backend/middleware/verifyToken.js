import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    // Try cookie first (server must use cookie-parser)
    let token = req.cookies?.token;

    // Fallback to Authorization header: "Bearer <token>"
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("verifyToken - token found:", !!token); // debug

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // put user id and decoded token on req for controllers
    req.userId = decoded.id || decoded._id || decoded.userId;
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
};