import { Account } from "../models/account.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

// ------------------------------------------------------------------
// Dashboard Stats
// ------------------------------------------------------------------
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await Account.countDocuments({ role: "user" });
    const totalSellers = await Account.countDocuments({ role: "seller" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate Revenue (Simple sum of all orders)
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const pendingSellers = await Account.countDocuments({ role: "seller", isSellerVerified: false });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingSellers
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// User Management
// ------------------------------------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await Account.find({ role: "user" }).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// Seller Management
// ------------------------------------------------------------------
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Account.find({ role: "seller" }).select("-password");
    res.status(200).json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // true (approve) or false (reject/block)
    
    // Toggle isSellerVerified
    const seller = await Account.findByIdAndUpdate(id, { isSellerVerified: status }, { new: true });
    
    res.status(200).json({ success: true, message: `Seller ${status ? 'verified' : 'unverified'}`, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    // Optionally delete their products
    await Product.deleteMany({ seller: req.params.id });
    res.status(200).json({ success: true, message: "Seller and their products deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// Product Management
// ------------------------------------------------------------------
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// Order Management
// ------------------------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("items.product", "name price seller")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
