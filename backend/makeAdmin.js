import mongoose from "mongoose";
import dotenv from "dotenv";
import { Account } from "./models/account.model.js";

dotenv.config();

const makeAdmin = async () => {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error("Error: Please provide an email address.");
      console.log("Usage: node makeAdmin.js <email>");
      process.exit(1);
    }

    console.log(`Attempting to make ${email} an admin...`);

    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is missing from .env");
        return;
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const user = await Account.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    user.role = "admin";
    await user.save();
    console.log(`SUCCESS: User ${email} has been updated to ADMIN.`);
    console.log("You can now login at /login/admin");

  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

makeAdmin();
