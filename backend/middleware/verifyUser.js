import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyUser = (req, res, next) => {
  try {
    const token =
      req.cookies?.user_token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
