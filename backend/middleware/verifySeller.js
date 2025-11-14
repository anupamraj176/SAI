import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifySeller = (req, res, next) => {
  try {
    const token = req.cookies?.seller_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return res.status(401).json({ success: false, message: "Seller not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "seller") return res.status(403).json({ success: false, message: "Unauthorized" });

    req.sellerId = decoded.id;
    req.seller = decoded;
    next();
  } catch (err) {
    console.error("verifySeller error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
