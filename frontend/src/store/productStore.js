import { create } from "zustand";
import axios from "axios";

const API_URL = "/api/products";
axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
    products: [],
    isLoading: false,
    error: null,

    // 1. Add Product (Seller)
    addProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/create`, productData);
            set((state) => ({
                products: [...state.products, response.data.product],
                isLoading: false
            }));
            return { success: true, message: "Product added successfully" };
        } catch (error) {
            console.error("Add Product Error:", error);
            set({ error: error.response?.data?.message || "Error adding product", isLoading: false });
            return { success: false, message: error.response?.data?.message || "Error adding product" };
        }
    },

    // 2. Fetch Seller Products (Seller Dashboard)
    fetchSellerProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/my-products`);
            set({ products: response.data.products, isLoading: false });
        } catch (error) {
            console.error("Fetch Seller Products Error:", error);
            set({ error: "Failed to fetch products", isLoading: false });
        }
    },

    // 3. Fetch All Products (User Marketplace)
    fetchAllProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log("Fetching all products for marketplace...");
            const response = await axios.get(`${API_URL}/`); // Hits http://localhost:5001/api/products/
            console.log("Marketplace Data Received:", response.data.products);
            
            set({ products: response.data.products, isLoading: false });
        } catch (error) {
            console.error("Fetch All Products Error:", error);
            set({ error: "Failed to fetch products", isLoading: false });
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
            const response = await axios.put(`${API_URL}/${id}`, formData);
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

const handleAddProduct = async (e) => {
    e.preventDefault(); 
    
    const formData = new FormData();
    // ... append your data ...

    await addProduct(formData);
};