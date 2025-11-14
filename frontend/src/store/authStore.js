import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "/api/user/auth";


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error signing up", isLoading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error logging in", isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      set({ error: "Error logging out", isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Error verifying email", isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    await new Promise((r) => setTimeout(r, 500));
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (err) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error sending reset email", isLoading: false });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: res.data.message, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error resetting password", isLoading: false });
      throw err;
    }
  },
}));
