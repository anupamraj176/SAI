import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = ({ role = "user" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.isVerified && user?.role === role) {
      if (role === "seller") {
        navigate("/seller/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      if (role === "seller") {
        navigate("/seller/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-11/12 max-w-md sm:w-full bg-[#1F3326]/80 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-[#347B66]/50"
    >
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#6FA99F] to-[#CFF56E] text-transparent bg-clip-text">
          {role === "seller" ? "Seller Login" : role === "admin" ? "Admin Login" : "User Login"}
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

          <div className="flex items-center mb-6">
            <Link
              to={role === "seller" ? "/forgot/seller" : role === "admin" ? "/forgot/admin" : "/forgot"}
              className="text-sm text-[#CFF56E] hover:text-[#6FA99F] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#347B66] to-[#6FA99F] text-white font-bold rounded-lg shadow-lg hover:from-[#6FA99F] hover:to-[#CFF56E] focus:outline-none focus:ring-2 focus:ring-[#6FA99F] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-black/20 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to={role === "seller" ? "/signup/seller" : "/signup"}
            className="text-[#CFF56E] hover:text-[#6FA99F] hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
