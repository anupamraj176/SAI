import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore"; // ✅ Correct import

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-40 max-w-md w-full bg-[#2B2B2B]/70 backdrop-blur-xl border border-[#C24C30]/40 
                 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
                       from-[#FBC42E] via-[#E66A32] to-[#C24C30] text-transparent bg-clip-text">
          Create Account
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
          <PasswordStrengthMeter password={password} />

          {error && <p className="text-[#8C2F2B] font-semibold mt-2">{error}</p>}

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-[#E66A32] to-[#C24C30] text-white 
                       font-bold rounded-lg shadow-lg hover:from-[#C24C30]
                       hover:to-[#8C2F2B] focus:outline-none focus:ring-2 focus:ring-[#FBC42E]/60 
                       focus:ring-offset-2 focus:ring-offset-[#2B2B2B] transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto text-[#FBC42E]" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-[#1a1a1a]/60 flex justify-center">
        <p className="text-sm text-[#FFD9A0]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FBC42E] hover:text-[#E66A32] hover:underline transition-colors">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
