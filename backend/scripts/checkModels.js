import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing in .env file");
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Access the model directly if listModels is not exposed on the main class in this version
        // The SDK usually exposes it via a specific manager or we can try a simple generation with a known model.
        
        // Try to list models via REST API
        console.log("Listing models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Failed to list models:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
