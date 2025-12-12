import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./models/order.model.js";

dotenv.config();

const debugOrders = async () => {
  try {
    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is missing from .env");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const orders = await Order.find({});
    console.log("------------------------------------------------");
    console.log(`Total Orders Found: ${orders.length}`);
    console.log("------------------------------------------------");
    
    orders.forEach(o => {
        console.log(`Order ID: ${o._id} | User: ${o.user} | Amount: ${o.totalAmount} | Status: ${o.status}`);
    });
    console.log("------------------------------------------------");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

debugOrders();
