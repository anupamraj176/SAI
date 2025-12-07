import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export const getCropAdvice = async (req, res) => {
    try {
        const { query } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Server API Key missing" });
        }

        if (!query) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // CHANGED: Using 'gemini-2.0-flash' as confirmed by your logs
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are CropSense AI, an expert agricultural consultant. 
            Answer this farming question: ${query}
            Keep it concise, practical, and helpful for a farmer.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ success: true, response: text });

    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "AI Error: " + (error.message || "Failed to generate advice") 
        });
    }
};