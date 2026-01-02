import { Toaster } from "react-hot-toast";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#E8F5E9] text-[#1F3326]">
      {children}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
