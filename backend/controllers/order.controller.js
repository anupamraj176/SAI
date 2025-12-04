import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const newOrder = new Order({
            buyer: req.userId,
            items,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.userId })
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get orders for a specific seller
export const getSellerOrders = async (req, res) => {
    try {
        // 1. Find all products belonging to this seller
        const sellerProducts = await Product.find({ seller: req.userId }).select('_id');
        const sellerProductIds = sellerProducts.map(p => p._id);

        // 2. Find orders that contain any of these products
        const orders = await Order.find({
            "items.product": { $in: sellerProductIds }
        })
        .populate("buyer", "name email") // Get buyer details
        .populate("items.product")
        .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};