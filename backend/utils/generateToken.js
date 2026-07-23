import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
});

// USER TOKEN
export const generateUserToken = (res, userId) => {
  const token = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("user_token", token, getCookieOptions());

  return token;
};

// SELLER TOKEN
export const generateSellerToken = (res, sellerId) => {
  const token = jwt.sign({ id: sellerId, role: "seller" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("seller_token", token, getCookieOptions());

  return token;
};

// CLEAR USER TOKEN
export const clearUserToken = (res) => {
  res.clearCookie("user_token", getClearCookieOptions());
};

// CLEAR SELLER TOKEN
export const clearSellerToken = (res) => {
  res.clearCookie("seller_token", getClearCookieOptions());
};

// GENERATE AUTH TOKEN
export const generateAuthToken = (payload, secret, expiresIn = "7d") => {
  // payload must include { id, role }
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
};

// GENERATE TOKEN AND SET COOKIE
export const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, getCookieOptions());

  return token;
};
