import { Account } from "../models/account.model.js";
import { Product } from "../models/product.model.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Account.findById(userId).populate("wishlist");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const user = await Account.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const index = user.wishlist.indexOf(productId);
    let message = "";

    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
      message = "Added to wishlist";
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
      message = "Removed from wishlist";
    }

    await user.save();
    
    // Return the updated wishlist (populated)
    await user.populate("wishlist");

    res.status(200).json({ success: true, message, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
