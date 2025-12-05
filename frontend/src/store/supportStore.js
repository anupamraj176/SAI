import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/support";
axios.defaults.withCredentials = true;

export const useSupportStore = create((set) => ({
    isLoading: false,
    error: null,

    createTicket: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/create`, formData);
            set({ isLoading: false });
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error submitting ticket", 
                isLoading: false 
            });
            return { 
                success: false, 
                message: error.response?.data?.message || "Error submitting ticket" 
            };
        }
    }
}));