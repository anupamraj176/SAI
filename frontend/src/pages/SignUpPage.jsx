import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = ({ role = "user" }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading, isAuthenticated, user } = useAuthStore();

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name, role);
      navigate("/verify-email");
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
          {role === "seller" ? "Create Seller Account" : "Create User Account"}
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-[#347B66] to-[#6FA99F] text-white font-bold rounded-lg shadow-lg hover:from-[#6FA99F] hover:to-[#CFF56E] focus:outline-none focus:ring-2 focus:ring-[#6FA99F] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className=" animate-spin mx-auto" size={24} /> : "Sign Up"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-black/20 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to={role === "seller" ? "/login/seller" : "/login"}
            className="text-[#CFF56E] hover:text-[#6FA99F] hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default SignUpPage;
