import { Support } from "../models/support.model.js";
import { sendSupportEmail } from "../mailer/mail.js"; // Import the mailer function

export const createSupportTicket = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 1. Save to Database
        const ticket = new Support({
            user: req.userId || null,
            name,
            email,
            subject,
            message
        });

        await ticket.save();

        // 2. Send Email Notification to Admin
        // We run this asynchronously without awaiting so the user gets a fast response
        sendSupportEmail(name, email, subject, message);

        res.status(201).json({ success: true, message: "Support ticket created successfully" });
    } catch (error) {
        console.error("Error creating support ticket:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};