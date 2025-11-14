import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// USER TOKEN
export const generateUserToken = (res, userId) => {
  const token = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("user_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// SELLER TOKEN
export const generateSellerToken = (res, sellerId) => {
  const token = jwt.sign({ id: sellerId, role: "seller" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("seller_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// CLEAR USER TOKEN
export const clearUserToken = (res) => {
  res.clearCookie("user_token");
};

// CLEAR SELLER TOKEN
export const clearSellerToken = (res) => {
  res.clearCookie("seller_token");
};
