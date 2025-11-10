// src/components/LoadingSpinner.jsx
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-900 text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-16 h-16 border-4 border-t-green-400 border-emerald-700 rounded-full"
      />
      <p className="mt-4 text-lg font-semibold text-green-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
