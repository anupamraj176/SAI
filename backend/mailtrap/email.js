import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.error(" Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

// send welcome email

export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "7b79d56a-fa66-474e-b3fa-884e3b18a30a",
			template_variables: {
				company_info_name: "Farmer Connect",
				name: name,
			},
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipients = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error(" Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

// Send reset success email
export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("✅ Password reset success email sent successfully");
  } catch (error) {
    console.error("❌ Error sending reset success email:", error);
    throw new Error("Error sending reset success email");
  }
};