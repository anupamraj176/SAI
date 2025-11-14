"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ icon: Icon, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {Icon && <Icon className="size-5 text-[#FBC42E]" />}
      </div>

      <input
        {...props}
        type={inputType}
        className="w-full pl-10 pr-10 py-2 bg-[#2B2B2B]/70 rounded-lg border border-[#C24C30]/40 focus:border-[#E66A32] focus:ring-2 focus:ring-[#E66A32]/60 text-[#FFD9A0] placeholder-[#FFD9A0]/50 transition duration-200 outline-none"
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD9A0]/60 hover:text-[#FBC42E] focus:outline-none"
        >
          <AnimatePresence mode="wait" initial={false}>
            {showPassword ? (
              <motion.span key="eye-off" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.25 }}>
                <EyeOff size={20} />
              </motion.span>
            ) : (
              <motion.span key="eye" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.25 }}>
                <Eye size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
};

export default Input;
