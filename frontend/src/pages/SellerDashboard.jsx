import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import FarmerNavbar from "../components/FarmerNavbar";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <FarmerNavbar />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-[#2B2B2B]/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-[#8C2F2B]/50 p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#FF8C42] to-[#FFD9A0] text-transparent bg-clip-text">
            Seller Dashboard
          </h2>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-black/30 rounded-lg border border-[#8C2F2B]/30"
            >
              <h3 className="text-xl font-semibold text-[#FF8C42] mb-3">Profile Information</h3>
              <p className="text-gray-300">Name: {user.name}</p>
              <p className="text-gray-300">Email: {user.email}</p>
              <p className="text-gray-300">
                Role: <span className="uppercase font-bold text-[#E66A32]">{user.role}</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-black/30 rounded-lg border border-[#8C2F2B]/30"
            >
              <h3 className="text-xl font-semibold text-[#FF8C42] mb-3">Account Activity</h3>
              <p className="text-gray-300">
                <span className="font-bold">Joined: </span>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-300">
                <span className="font-bold">Last Login: </span>
                {formatDate(user.lastLogin)}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C24C30] to-[#E66A32] text-white font-bold rounded-lg shadow-lg hover:from-[#E66A32] hover:to-[#FF8C42] focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Logout
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SellerDashboard;