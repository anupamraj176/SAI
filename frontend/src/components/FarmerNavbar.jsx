"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../store/authStore";
import { useSellerAuthStore } from "../seller/store/sellerAuthStore";
import { FaUserAlt, FaStore, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function FarmerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // both stores: logout will try to log out user or seller (one will be no-op)
  const { logout: userLogout } = useAuthStore();
  const { logout: sellerLogout } = useSellerAuthStore();

  const handleLogout = async () => {
    try {
      // Try both — whichever is logged in will be logged out
      await Promise.allSettled([userLogout(), sellerLogout()]);
      // no navigation here — front-end app routes will reflect auth state
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Crops", link: "#crops" },
    { name: "Fertilizers", link: "#fertilizers" },
    { name: "Market", link: "#market" },
    { name: "Support", link: "#support" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFD9A0] text-[#8C2F2B] shadow-lg border-b border-[#C24C30]/30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/assets/farmer-logo.png" alt="Farmer Logo" className="w-12 h-12 drop-shadow-sm" />
          <span className="text-lg font-bold text-[#C24C30] tracking-wide">
            Farmer<span className="text-[#FF8C42]">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {navItems.map((item, i) => (
              <li key={i}>
                <a href={item.link} className="text-[#8C2F2B]/80 hover:text-[#C24C30] transition-all duration-200">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-md bg-[#C24C30] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#E66A32] transition-all">
              <FaUserAlt /> User
            </motion.button>
          </Link>

          <Link to="/seller/login">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-md border border-[#FF8C42] px-4 py-2 text-sm font-semibold text-[#8C2F2B] shadow-sm hover:bg-[#FF8C42] hover:text-white transition-all">
              <FaStore /> Seller
            </motion.button>
          </Link>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
            className="flex items-center gap-2 rounded-md bg-[#8C2F2B] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#C24C30] transition-all">
            <FaSignOutAlt /> Logout
          </motion.button>

          <button className="block rounded-md p-2 text-[#8C2F2B] hover:text-[#C24C30] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#FFD9A0] border-t border-[#C24C30]/30 shadow-inner">
            <ul className="flex flex-col px-4 py-4 space-y-3 text-sm font-medium">
              {navItems.map((item, i) => (
                <li key={i}>
                  <a href={item.link} onClick={() => setMenuOpen(false)}
                    className="block text-[#8C2F2B]/90 hover:text-[#C24C30] transition-all">
                    {item.name}
                  </a>
                </li>
              ))}

              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md bg-[#C24C30] px-4 py-2 text-white font-semibold shadow-md hover:bg-[#E66A32] transition-all">
                  <FaUserCircle /> User
                </Link>
              </li>

              <li>
                <Link to="/seller/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md border border-[#FF8C42] px-4 py-2 text-[#8C2F2B] font-semibold hover:bg-[#FF8C42] hover:text-white transition-all">
                  <FaStore /> Seller
                </Link>
              </li>

              <li>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full rounded-md bg-[#8C2F2B] px-4 py-2 text-white font-semibold shadow-md hover:bg-[#C24C30] transition-all">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
