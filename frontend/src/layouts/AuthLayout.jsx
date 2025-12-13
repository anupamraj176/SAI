import { Toaster } from "react-hot-toast";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#FAF3E3] text-[#2B2B2B]">
      {children}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
