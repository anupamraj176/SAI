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
        
        // List of models to try in order of preference to handle rate limits
        // Including newer 2.5 models which might have separate quotas
        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.0-flash", 
            "gemini-2.0-flash-exp"
        ];
        
        let lastError = null;
        let text = null;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting AI generation with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                    You are CropSense AI, an expert agricultural consultant. 
                    Answer this farming question: ${query}
                    Keep it concise, practical, and helpful for a farmer.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();
                
                if (text) break; // Success!
            } catch (e) {
                console.warn(`Model ${modelName} failed: ${e.message}`);
                lastError = e;
                // Wait a bit before trying the next model to avoid hammering the API
                await delay(1000);
            }
        }

        if (!text) {
            throw lastError || new Error("All AI models failed to respond.");
        }

        res.status(200).json({ success: true, response: text });

    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "AI Error: " + (error.message || "Failed to generate advice") 
        });
    }
};