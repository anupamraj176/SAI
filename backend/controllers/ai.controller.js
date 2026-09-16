import { GoogleGenerativeAI } from "@google/generative-ai";
import CircuitBreaker from "opossum";
import dotenv from "dotenv";

dotenv.config();

// 1. The core function that actually calls Gemini
const fetchAIResponse = async (query) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"];
    
    let lastError = null;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting AI generation with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const prompt = `You are CropSense AI, an expert agricultural consultant. Answer this farming question: ${query}. Keep it concise, practical, and helpful for a farmer.`;

            const result = await model.generateContent(prompt);
            return await result.response.text(); 
        } catch (e) {
            console.warn(`Model ${modelName} failed: ${e.message}`);
            lastError = e;
            await delay(500);
        }
    }
    throw lastError || new Error("All AI models failed");
};

// 2. Wrap the core function in a Circuit Breaker!
const aiBreaker = new CircuitBreaker(fetchAIResponse, {
    timeout: 10000, 
    errorThresholdPercentage: 50, 
    resetTimeout: 30000 
});

aiBreaker.fallback(() => "I am currently overloaded with farming questions right now! Please try again in 30 seconds.");

aiBreaker.on('open', () => console.warn('🔴 AI Circuit Breaker is OPEN. Blocking requests.'));
aiBreaker.on('halfOpen', () => console.warn('🟡 AI Circuit Breaker is HALF-OPEN. Testing next request.'));
aiBreaker.on('close', () => console.log('🟢 AI Circuit Breaker is CLOSED. Normal operations.'));

// 3. Your Controller
export const getCropAdvice = async (req, res) => {
    try {
        const { query } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Server API Key missing" });
        }

        if (!query) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }

        // 🚀 Using the Circuit Breaker .fire() method!
        const text = await aiBreaker.fire(query);

        // If the text matches the fallback, we know the circuit is open
        if (text.includes("overloaded")) {
            return res.status(503).json({ success: false, message: "Service Unavailable", response: text });
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
