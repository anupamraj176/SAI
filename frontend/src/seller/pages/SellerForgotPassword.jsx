import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSellerAuthStore } from "../store/sellerAuthStore";

const SellerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { forgotPassword, isLoading } = useSellerAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-[#2B2B2B]/70 backdrop-blur-xl border border-[#C24C30]/40 
                 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
                     from-[#FBC42E] via-[#E66A32] to-[#C24C30] text-transparent bg-clip-text"
        >
          Seller Forgot Password
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-[#FFD9A0]/80 mb-6 text-center">
              Enter your seller email, and we’ll send you a link to reset your password.
            </p>

            <Input
              icon={Mail}
              type="email"
              placeholder="Seller Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white font-bold 
                         rounded-lg shadow-lg hover:from-[#C24C30] hover:to-[#8C2F2B] 
                         focus:outline-none focus:ring-2 focus:ring-[#FBC42E]/60 
                         focus:ring-offset-2 focus:ring-offset-[#2B2B2B] transition duration-200"
              type="submit"
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin mx-auto text-[#FBC42E]" />
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-[#FBC42E] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-[#2B2B2B]" />
            </motion.div>

            <p className="text-[#FFD9A0]/90 mb-6">
              If an account exists for{" "}
              <span className="text-[#FBC42E]">{email}</span>, a reset link has been sent.
            </p>
          </div>
        )}
      </div>

      {/* Back to Login Footer */}
      <div className="px-8 py-4 bg-[#1a1a1a]/60 flex justify-center">
        <Link
          to={"/seller/login"}
          className="text-sm text-[#FBC42E] hover:text-[#E66A32] hover:underline flex items-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Seller Login
        </Link>
      </div>
    </motion.div>
  );
};

export default SellerForgotPassword;
