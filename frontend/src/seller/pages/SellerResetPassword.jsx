import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../components/Input";
import { Lock, Loader } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSellerAuthStore } from "../store/sellerAuthStore";

const SellerResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { resetPassword, isLoading } = useSellerAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    try {
      await resetPassword(token, password);
      navigate("/seller/login");
    } catch {
      setError("Failed to reset password");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-[#2B2B2B]/70 border border-[#C24C30]/40 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#FBC42E] to-[#C24C30] bg-clip-text text-transparent">Seller Reset Password</h2>

      <form onSubmit={handleSubmit} className="mt-6">
        <Input icon={Lock} type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input icon={Lock} type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <motion.button type="submit" disabled={isLoading} className="w-full py-3 mt-4 bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white rounded-lg">
          {isLoading ? <Loader className="animate-spin mx-auto" /> : "Reset Password"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SellerResetPassword;
