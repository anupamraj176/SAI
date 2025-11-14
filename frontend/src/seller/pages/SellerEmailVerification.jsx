import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSellerAuthStore } from "../store/sellerAuthStore";

const SellerEmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { isLoading, error, verifyEmail } = useSellerAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((digit, i) => (newCode[i] = digit));
      setCode(newCode);

      const nextEmpty = newCode.findIndex((d) => d === "");
      inputRefs.current[nextEmpty !== -1 ? nextEmpty : 5]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCode = code.join("");

    if (finalCode.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      await verifyEmail(finalCode);
      toast.success("Seller email verified!");
      setTimeout(() => navigate("/seller/login"), 800);
    } catch {
      toast.error("Invalid or expired verification code!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-40 max-w-md w-full bg-[#2B2B2B]/70 backdrop-blur-xl 
                 border border-[#C24C30]/40 rounded-2xl shadow-xl overflow-hidden p-8"
    >
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center 
                     bg-gradient-to-r from-[#FBC42E] via-[#E66A32] to-[#C24C30] 
                     text-transparent bg-clip-text">
        Verify Seller Email
      </h2>

      <p className="text-center text-[#FFD9A0]/90 mb-6">
        Enter the 6-digit verification code sent to your seller email.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold 
                         bg-[#1f1f1f] text-[#FFD9A0] 
                         border-2 border-[#C24C30]/40 
                         rounded-lg focus:border-[#FBC42E] focus:outline-none"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 font-semibold mt-2 text-center">{error}</p>
        )}

        {/* Verify button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isLoading || code.some((d) => !d)}
          className="w-full bg-gradient-to-r from-[#E66A32] to-[#C24C30] 
                     text-white font-bold py-3 px-4 rounded-lg shadow-lg 
                     hover:from-[#C24C30] hover:to-[#8C2F2B] 
                     focus:outline-none focus:ring-2 focus:ring-[#FBC42E]/60 
                     disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SellerEmailVerification;
