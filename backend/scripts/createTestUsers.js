import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Account } from "./models/account.model.js";

dotenv.config();

const createTestUsers = async () => {
  try {
    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is missing from .env");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const usersToCreate = [
      { email: "testuser@example.com", name: "Test User", role: "user", isVerified: true },
      { email: "testseller@example.com", name: "Test Seller", role: "seller", isVerified: true, isSellerVerified: true },
      { email: "testadmin@example.com", name: "Test Admin", role: "admin", isVerified: true }
    ];

    const hashedPassword = await bcrypt.hash("password123", 10);

    for (const u of usersToCreate) {
      let account = await Account.findOne({ email: u.email, role: u.role });
      if (account) {
        account.password = hashedPassword;
        account.isVerified = u.isVerified;
        if (u.role === "seller") {
          account.isSellerVerified = u.isSellerVerified;
        }
        await account.save();
        console.log(`Updated user: ${u.email}`);
      } else {
        account = new Account({
          ...u,
          password: hashedPassword,
        });
        await account.save();
        console.log(`Created user: ${u.email}`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestUsers();
