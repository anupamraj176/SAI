import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { useSellerAuthStore } from "../store/sellerAuthStore";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useSellerAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/seller/dashboard");
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-40 max-w-md w-full bg-[#2B2B2B]/90 border border-[#C24C30]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#FBC42E] to-[#C24C30] bg-clip-text text-transparent">
        Seller Login
      </h2>

      <form onSubmit={handleLogin}>
        <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white font-bold"
        >
          {isLoading ? <Loader className="animate-spin mx-auto" /> : "Login as Seller"}
        </motion.button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/seller/forgot-password" className="text-[#FFD9A0] hover:text-[#FBC42E]">
          Forgot Password?
        </Link>
      </div>

      <div className="mt-6 text-center text-[#FFD9A0]">
        New seller?{" "}
        <Link to="/seller/signup" className="text-[#FBC42E] hover:text-[#E66A32] underline">
          Create account
        </Link>
      </div>
    </motion.div>
  );
};

export default SellerLogin;
