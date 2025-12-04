import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";
axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    createOrder: async (cartItems, totalAmount) => {
        set({ isLoading: true, error: null });
        try {
            // Format items for backend
            const items = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price
            }));

            const response = await axios.post(`${API_URL}/create`, { items, totalAmount });
            set((state) => ({
                orders: [response.data.order, ...state.orders],
                isLoading: false
            }));
            return { success: true, message: "Order placed successfully" };
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to place order", isLoading: false });
            return { success: false, message: error.response?.data?.message || "Failed to place order" };
        }
    },

    fetchUserOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/my-orders`);
            set({ orders: response.data.orders, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch orders", isLoading: false });
        }
    },

    fetchSellerOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/seller-orders`);
            set({ orders: response.data.orders, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch seller orders", isLoading: false });
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            await axios.put(`${API_URL}/${orderId}/status`, { status });
            set((state) => ({
                orders: state.orders.map((order) =>
                    order._id === orderId ? { ...order, status } : order
                ),
            }));
            return { success: true, message: "Status updated" };
        } catch (error) {
            return { success: false, message: "Failed to update status" };
        }
    }
}));