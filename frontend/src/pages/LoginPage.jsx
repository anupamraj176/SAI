import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-40 max-w-md w-full bg-[#2B2B2B]/90 backdrop-blur-xl border border-[#C24C30]/30 
                 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Main Card */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
                       from-[#FBC42E] via-[#E66A32] to-[#C24C30] text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between mb-6">
            <Link to="/forgot-password" className="text-sm text-[#FFD9A0] hover:text-[#FBC42E] transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Error Display */}
          {error && <p className="text-[#8C2F2B] font-semibold mb-2">{error}</p>}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white 
                       font-bold rounded-lg shadow-lg hover:from-[#C24C30] hover:to-[#8C2F2B] 
                       focus:outline-none focus:ring-2 focus:ring-[#FBC42E]/60 focus:ring-offset-2 
                       focus:ring-offset-[#2B2B2B] transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-[#1a1a1a] bg-opacity-60 flex justify-center">
        <p className="text-sm text-[#FFD9A0]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#FBC42E] hover:text-[#E66A32] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
