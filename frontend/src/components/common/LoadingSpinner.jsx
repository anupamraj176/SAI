import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9]">
      <motion.div
        className="w-16 h-16 border-4 border-[#6FA99F] border-t-[#347B66] rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
