import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const to = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });
    console.log("Verification email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const to = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to,
      template_uuid: "7b79d56a-fa66-474e-b3fa-884e3b18a30a",
      template_variables: { company_info_name: "Farmer Connect", name },
    });
    console.log("Welcome email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const to = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to,
      subject: "Reset Your Password - SAI",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Password reset email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const sendResetSuccessEmail = async (email) => {
  const to = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to,
      subject: "Your password was reset - SAI",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("Password reset success email sent:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw error;
  }
};