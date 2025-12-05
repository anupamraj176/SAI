import { transporter } from "../config/emailConfig.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  SUPPORT_TICKET_TEMPLATE,
} from "./emailTemplate.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

// ✅ Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: `"SAI Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - SAI",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent successfully");
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// ✅ Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const msg = {
      from: `"SAI Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to SAI!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    };
    await transporter.sendMail(msg);
    console.log("✅ Welcome email sent successfully");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

// ✅ Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const msg = {
      from: `"SAI Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - SAI",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };
    await transporter.sendMail(msg);
    console.log("✅ Password reset email sent successfully");
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// ✅ Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const msg = {
      from: `"SAI Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful - SAI",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };
    await transporter.sendMail(msg);
    console.log("✅ Password reset success email sent");
  } catch (error) {
    console.error("❌ Error sending reset success email:", error);
    throw new Error("Failed to send reset success email");
  }
};

// ✅ Send support email
export const sendSupportEmail = async (name, email, subject, message) => {
  try {
    const response = await transporter.sendMail({
      from: `FarmerHub Support <${process.env.EMAIL_USER}>`,
      to: "anupamraj176@gmail.com", 
      replyTo: email, 
      subject: `[Support] ${subject} - from ${name}`,
      html: SUPPORT_TICKET_TEMPLATE
        .replace("{name}", name)
        .replace("{email}", email)
        .replace("{subject}", subject)
        .replace("{message}", message),
    });
    console.log("Support email sent successfully", response);
  } catch (error) {
    console.error("Error sending support email", error);
    // We don't throw error here to prevent blocking the UI if email fails
  }
};
