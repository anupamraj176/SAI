import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "/api/seller/auth";

export const useSellerAuthStore = create((set) => ({
  seller: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingSellerAuth: true,
  message: null,
  
signup: async (email, password, shopName) => {
  set({ isLoading: true, error: null });
  try {
    const res = await axios.post(`${API_URL}/signup`, { email, password, shopName });
    set({ seller: res.data.seller, isAuthenticated: true, isLoading: false });
  } catch (err) {
    set({ error: err.response?.data?.message || "Signup failed", isLoading: false });
    throw err;
  }
},


  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      set({ seller: res.data.seller, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ seller: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      set({ error: "Logout failed", isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { code });
      set({ seller: res.data.seller, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Email verification failed", isLoading: false });
      throw err;
    }
  },

  checkSellerAuth: async () => {
    await new Promise((r) => setTimeout(r, 300));
    set({ isCheckingSellerAuth: true });

    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({ seller: res.data.seller, isAuthenticated: true, isCheckingSellerAuth: false });
    } catch {
      set({ seller: null, isAuthenticated: false, isCheckingSellerAuth: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to send reset link", isLoading: false });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Reset failed", isLoading: false });
      throw err;
    }
  },
}));
