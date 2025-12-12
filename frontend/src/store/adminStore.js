import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5001/api/admin";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
  stats: null,
  users: [],
  sellers: [],
  products: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/stats`);
      set({ stats: response.data.stats, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/users`);
      set({ users: response.data.users, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },

  fetchSellers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/sellers`);
      set({ sellers: response.data.sellers, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  verifySeller: async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/sellers/${id}/verify`, { status });
      set((state) => ({
        sellers: state.sellers.map((s) => (s._id === id ? response.data.seller : s)),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteSeller: async (id) => {
    try {
      await axios.delete(`${API_URL}/sellers/${id}`);
      set((state) => ({ sellers: state.sellers.filter((s) => s._id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/products`);
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      set((state) => ({ products: state.products.filter((p) => p._id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/orders`);
      set({ orders: response.data.orders, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? response.data.order : o)),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
