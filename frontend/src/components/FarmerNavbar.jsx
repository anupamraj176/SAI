"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useAuthStore } from "../store/authStore";
import { FaUserAlt, FaStore, FaSignOutAlt, FaUserCircle, FaLeaf, FaUserShield } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function FarmerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Unified Auth Store
  const { logout, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Crops", link: "/#crops" },
    { name: "Fertilizers", link: "/#fertilizers" },
    { name: "Market", link: "/#market" },
    { name: "Education", link: "/education" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFD9A0] text-[#8C2F2B] shadow-lg border-b border-[#C24C30]/30">

      {/* MAIN NAVBAR WRAPPER */}
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between 
      px-3 md:px-6 lg:px-8 gap-2 md:gap-4">

        {/* LOGO (responsive sizes) */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img
            src="/assets/farmer-logo.png"
            alt="Farmer Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-12 md:h-12 drop-shadow-sm"
            onError={(e) => {e.target.style.display='none'}} // Fallback if image missing
          />
          <span className="text-base sm:text-lg font-bold text-[#C24C30] tracking-wide whitespace-nowrap">
            Farmer<span className="text-[#FF8C42]">Hub</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex items-center gap-4 md:gap-8 text-xs sm:text-sm font-medium">
            {navItems.map((item, i) => (
              <li key={i}>
                {item.link.startsWith("/#") ? (
                  <a
                    href={item.link}
                    className="text-[#8C2F2B]/80 hover:text-[#C24C30] transition-all duration-200"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className={`text-[#8C2F2B]/80 hover:text-[#C24C30] transition-all duration-200 ${location.pathname === item.link ? 'font-bold text-[#C24C30]' : ''}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-2 md:gap-3">

          {!isAuthenticated ? (
            <>
              {/* USER BUTTON (hidden on mobile) */}
              <Link to="/login" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-[#C24C30] px-5 py-2 text-sm 
                  font-semibold text-white shadow-sm hover:bg-[#E66A32] transition-all"
                >
                  <FaUserAlt /> User
                </motion.button>
              </Link>

              {/* SELLER BUTTON (hidden on mobile) */}
              <Link to="/login/seller" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-[#FF8C42] px-5 py-2 
                  text-sm font-semibold text-[#8C2F2B] hover:bg-[#FF8C42] hover:text-white transition-all"
                >
                  <FaStore /> Seller
                </motion.button>
              </Link>

              {/* ADMIN BUTTON (hidden on mobile) */}
              <Link to="/login/admin" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-[#8C2F2B] px-5 py-2 
                  text-sm font-semibold text-[#8C2F2B] hover:bg-[#8C2F2B] hover:text-white transition-all"
                >
                  <FaUserShield /> Admin
                </motion.button>
              </Link>
            </>
          ) : (
            <>
               {/* DASHBOARD BUTTON */}
               <Link 
                 to={
                   user?.role === 'seller' ? "/seller/dashboard" : 
                   user?.role === 'admin' ? "/admin/dashboard" : 
                   "/dashboard"
                 } 
                 className="hidden md:block"
               >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl bg-[#C24C30] px-5 py-2 text-sm 
                  font-semibold text-white shadow-sm hover:bg-[#E66A32] transition-all"
                >
                  <FaLeaf /> Dashboard
                </motion.button>
              </Link>

              {/* LOGOUT ALWAYS VISIBLE IF AUTHENTICATED */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-[#8C2F2B] px-5 py-2 text-sm 
                font-semibold text-white shadow-sm hover:bg-[#C24C30] transition-all"
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </>
          )}

          {/* MOBILE MENU ICON */}
          <button
            className="block rounded-md p-1.5 text-[#8C2F2B] hover:text-[#C24C30] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#FFD9A0] border-t border-[#C24C30]/30 shadow-inner"
          >
            <ul className="flex flex-col px-4 py-4 space-y-3 text-sm font-medium">

              {/* MOBILE NAV ITEMS */}
              {navItems.map((item, i) => (
                <li key={i}>
                  {item.link.startsWith("/#") ? (
                    <a
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="block text-[#8C2F2B]/90 hover:text-[#C24C30] transition-all"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="block text-[#8C2F2B]/90 hover:text-[#C24C30] transition-all"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}

              {!isAuthenticated ? (
                <>
                  {/* MOBILE USER */}
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-md bg-[#C24C30] px-4 py-2 text-white 
                      font-semibold shadow-md hover:bg-[#E66A32] transition-all"
                    >
                      <FaUserCircle /> User Login
                    </Link>
                  </li>

                  {/* MOBILE SELLER */}
                  <li>
                    <Link
                      to="/login/seller"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-md border border-[#FF8C42] px-4 py-2 
                      text-[#8C2F2B] font-semibold hover:bg-[#FF8C42] hover:text-white transition-all"
                    >
                      <FaStore /> Seller Login
                    </Link>
                  </li>

                  {/* MOBILE ADMIN */}
                  <li>
                    <Link
                      to="/login/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-md border border-[#8C2F2B] px-4 py-2 
                      text-[#8C2F2B] font-semibold hover:bg-[#8C2F2B] hover:text-white transition-all"
                    >
                      <FaUserShield /> Admin Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                   {/* MOBILE DASHBOARD */}
                   <li>
                    <Link
                      to={
                        user?.role === 'seller' ? "/seller/dashboard" : 
                        user?.role === 'admin' ? "/admin/dashboard" : 
                        "/dashboard"
                      }
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-md bg-[#C24C30] px-4 py-2 text-white 
                      font-semibold shadow-md hover:bg-[#E66A32] transition-all"
                    >
                      <FaLeaf /> Dashboard
                    </Link>
                  </li>

                  {/* MOBILE LOGOUT */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full rounded-md bg-[#8C2F2B] px-4 py-2 text-white 
                      font-semibold shadow-md hover:bg-[#C24C30] transition-all"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </>
              )}

            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
