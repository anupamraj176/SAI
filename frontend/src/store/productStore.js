import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
    products: [],
    isLoading: false,
    error: null,

    addProduct: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set((state) => ({
                products: [response.data.product, ...state.products],
                isLoading: false,
            }));
            return { success: true, message: "Product added successfully" };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error adding product", isLoading: false });
            return { success: false, message: error.response?.data?.message || "Error adding product" };
        }
    },

    fetchSellerProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/my-products`);
            set({ products: response.data.products, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", isLoading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/all`);
            set({ products: response.data.products, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch all products", isLoading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${id}`);
            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
                isLoading: false,
            }));
            return { success: true, message: "Product deleted successfully" };
        } catch (error) {
            set({ error: "Failed to delete product", isLoading: false });
            return { success: false, message: "Failed to delete product" };
        }
    },

    updateProduct: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set((state) => ({
                products: state.products.map((p) => (p._id === id ? response.data.product : p)),
                isLoading: false,
            }));
            return { success: true, message: "Product updated successfully" };
        } catch (error) {
            set({ error: "Failed to update product", isLoading: false });
            return { success: false, message: "Failed to update product" };
        }
    }
}));