import mongoose from "mongoose";
import dotenv from "dotenv";
import { Account } from "./models/account.model.js";

dotenv.config();

const debugUsers = async () => {
  try {
    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is missing from .env");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const users = await Account.find({});
    console.log("------------------------------------------------");
    console.log(`Total Accounts Found: ${users.length}`);
    console.log("------------------------------------------------");
    
    users.forEach(u => {
        console.log(`Email: ${u.email} | Role: ${u.role} | Verified: ${u.isVerified}`);
    });
    console.log("------------------------------------------------");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

debugUsers();
