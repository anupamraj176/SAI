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
    
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Attach role to request
    next();
  } catch (error) {
    console.log("Error in verifyAuth ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};