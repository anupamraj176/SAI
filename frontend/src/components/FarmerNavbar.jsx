"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../store/authStore"; // ✅ Zustand store

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function FarmerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuthStore(); // ✅ access logout directly

  // 🧩 Logout handler
  const handleLogout = async () => {
    try {
      await logout(); // triggers Zustand logout
      console.log("✅ User logged out successfully");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Home", link: "#" },
    { name: "Crops", link: "#crops" },
    { name: "Fertilizers", link: "#fertilizers" },
    { name: "Market", link: "#market" },
    { name: "Support", link: "#support" },
  ];

  return (
    <header className="bg-[#2B2B2B] text-white sticky top-0 z-50 shadow-md border-b border-[#C24C30]/40 overflow-hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 🌾 Logo */}
        <a className="flex items-center gap-2 font-semibold" href="#">
          <img
            src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
            alt="Farmer Logo"
            className="w-7 h-7"
          />
          <span className="text-lg text-[#FBC42C] tracking-wide">FarmerHub</span>
        </a>

        {/* 🌿 Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {navItems.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="text-[#FFD9A0]/80 hover:text-[#FBC42C] transition-all"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 🌱 Right Side Buttons */}
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-[#E66A32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FBC42C] hover:text-black transition-all shadow-md">
            👨‍🌾 User
          </button>
          <button className="rounded-md bg-[#C24C30] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E66A32] transition-all shadow-md">
            🧑‍💼 Seller
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="rounded-md bg-[#8C2F2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C24C30] transition-all shadow-md"
          >
            🚪 Logout
          </button>

          {/* 🍃 Mobile Menu Toggle */}
          <button
            className="block rounded-md p-2 text-[#FFD9A0] hover:text-[#FBC42C] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#2B2B2B] border-t border-[#C24C30]/40 shadow-inner"
          >
            <ul className="flex flex-col px-4 py-4 space-y-3 text-sm font-medium">
              {navItems.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    onClick={() => setMenuOpen(false)}
                    className="block text-[#FFD9A0]/90 hover:text-[#FBC42C] transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <button className="w-full rounded-md bg-[#E66A32] px-4 py-2 text-white font-semibold hover:bg-[#FBC42C] hover:text-black">
                  👨‍🌾 User
                </button>
              </li>
              <li>
                <button className="w-full rounded-md bg-[#C24C30] px-4 py-2 text-white font-semibold hover:bg-[#E66A32]">
                  🧑‍💼 Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-md bg-[#8C2F2B] px-4 py-2 text-white font-semibold hover:bg-[#C24C30]"
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
