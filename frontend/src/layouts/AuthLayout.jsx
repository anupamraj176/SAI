import FloatingShape from "../components/FloatingShape";
import { Toaster } from "react-hot-toast";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden 
                    bg-gradient-to-br from-[#1a1a1a] via-[#2B2B2B] to-[#8C2F2B]">

      <FloatingShape color="bg-[#FBC42E]" size="w-72 h-72" top="-10%" left="15%" delay={0} duration={12} opacity="opacity-20" />
      <FloatingShape color="bg-[#E66A32]" size="w-56 h-56" top="20%" left="70%" delay={2} duration={10} opacity="opacity-25" />
      <FloatingShape color="bg-[#FFD9A0]" size="w-64 h-64" top="65%" left="25%" delay={4} duration={14} opacity="opacity-15" />
      <FloatingShape color="bg-[#C24C30]" size="w-80 h-80" top="40%" left="-10%" delay={6} duration={18} opacity="opacity-10" />
      <FloatingShape color="bg-[#8C2F2B]" size="w-48 h-48" top="80%" left="70%" delay={8} duration={16} opacity="opacity-20" />

      {children}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
