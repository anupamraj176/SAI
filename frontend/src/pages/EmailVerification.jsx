import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const { verifyEmail, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleInput = (i, v) => {
    const newCode = [...code];
    newCode[i] = v;
    setCode(newCode);

    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCode = code.join("");

    try {
      await verifyEmail(finalCode);
      toast.success("Email Verified!");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-[#2B2B2B]/70 backdrop-blur-xl 
                 border border-[#C24C30]/40 rounded-2xl p-8 shadow-xl"
    >
      <h2 className="text-3xl font-bold text-center 
                     bg-gradient-to-r from-[#FBC42E] via-[#E66A32] to-[#C24C30] 
                     text-transparent bg-clip-text">
        Verify Your Email
      </h2>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="flex justify-between">
          {code.map((c, i) => (
            <input
              key={i}
              maxLength="1"
              ref={(el) => (inputs.current[i] = el)}
              value={c}
              onChange={(e) => handleInput(i, e.target.value)}
              className="w-12 h-12 text-center text-xl font-bold
                         bg-[#1f1f1f] text-[#FFD9A0] 
                         border-2 border-[#C24C30]/40 rounded-lg 
                         focus:border-[#FBC42E] outline-none"
            />
          ))}
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 py-3 bg-gradient-to-r 
                     from-[#E66A32] to-[#C24C30] text-white 
                     rounded-lg font-bold shadow-lg 
                     hover:from-[#C24C30] hover:to-[#8C2F2B]"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EmailVerification;
