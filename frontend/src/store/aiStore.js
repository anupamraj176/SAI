import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5001/api/ai";
axios.defaults.withCredentials = true;

export const useAiStore = create((set) => ({
    isLoading: false,
    response: null,
    error: null,

    askAI: async (query) => {
        set({ isLoading: true, error: null, response: null });
        try {
            const res = await axios.post(`${API_URL}/ask`, { query });
            set({ response: res.data.response, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error connecting to AI", 
                isLoading: false 
            });
            return { success: false, message: error.response?.data?.message };
        }
    },
    
    clearResponse: () => set({ response: null, error: null })
}));