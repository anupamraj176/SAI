// src/components/LoadingSpinner.jsx
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen 
                    bg-gradient-to-br from-[#1a1a1a] via-[#2B2B2B] to-[#8C2F2B] text-[#FFD9A0]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-16 h-16 border-4 border-t-[#FBC42E] border-[#C24C30] rounded-full"
      />
      <p className="mt-4 text-lg font-semibold text-[#FBC42E]">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
