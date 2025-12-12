export const verifyAdmin = (req, res, next) => {
  console.log("VerifyAdmin Check - User:", req.user); // Debug log
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied. Admin only." });
  }
};
