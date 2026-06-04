import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env properly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Debug check
console.log("EMAIL_USER:", process.env.EMAIL_USER);
const emailPassword = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
console.log("EMAIL_PASSWORD loaded:", !!emailPassword);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPassword,
  },
});
