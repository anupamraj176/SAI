import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  const token = req.cookies.token; // Assuming you use cookies, or req.headers.authorization

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }
    
    // ✅ FIX: Set BOTH formats to prevent errors in different controllers
    req.userId = decoded.userId; // Old format
    req.user = {                 // New format (used in product controller)
        userId: decoded.userId,
        role: decoded.role
    };
    next();
  } catch (error) {
    console.log("Error in verifyAuth ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};