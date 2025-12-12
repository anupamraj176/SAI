import { create } from "zustand";
import axios from "axios";

const API_URL = "/api/wishlist";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ wishlist: response.data.wishlist, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching wishlist",
        isLoading: false,
      });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const response = await axios.post(`${API_URL}/toggle`, { productId });
      set({ wishlist: response.data.wishlist });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error updating wishlist",
      };
    }
  },

  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some((item) => item && (item._id === productId || item === productId));
  },
}));
