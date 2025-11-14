import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useSellerAuthStore } from "../store/sellerAuthStore";

const SellerSignup = () => {
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSellerAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, shopName);
      navigate("/seller/verify-email");
    } catch {}
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-[#2B2B2B]/70 border border-[#C24C30]/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#FBC42E] to-[#C24C30] bg-clip-text text-transparent">
        Seller Register
      </h2>

      <form onSubmit={handleSignup}>
        <Input icon={User} type="text" placeholder="Shop / Owner Name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
        <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <PasswordStrengthMeter password={password} />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="mt-5 w-full py-3 bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white rounded-lg font-bold"
        >
          {isLoading ? <Loader className="animate-spin mx-auto" /> : "Create Seller Account"}
        </motion.button>
      </form>

      <div className="mt-6 text-center text-[#FFD9A0]">
        Already a seller?{" "}
        <Link to="/seller/login" className="text-[#FBC42E] hover:text-[#E66A32] underline">Login</Link>
      </div>
    </motion.div>
  );
};

export default SellerSignup;
