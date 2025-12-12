import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import FloatingShape from "./components/FloatingShape";

// Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerification";
import UserDashboard from "./pages/UserDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import HomePage from "./pages/HomePage";
import EducationPage from "./pages/EducationPage"; 


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "seller") {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// --- Redirect Authenticated Users ---
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    if (user.role === "seller") {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// --- Background Wrapper (Shared) ---
const BackgroundWrapper = ({ children, className = "" }) => (
  <div className={`min-h-screen bg-gradient-to-br from-[#2B2B2B] via-[#8C2F2B] to-[#C24C30] relative overflow-hidden ${className}`}>
    <FloatingShape color="bg-[#FF8C42]" size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingShape color="bg-[#E66A32]" size="w-48 h-48" top="70%" left="80%" delay={5} />
    <FloatingShape color="bg-[#FFD9A0]" size="w-32 h-32" top="40%" left="-10%" delay={2} />
    {children}
  </div>
);

// --- Layouts ---
const AuthLayout = () => (
  <BackgroundWrapper className="flex items-center justify-center">
    <Outlet />
  </BackgroundWrapper>
);

const DashboardLayout = () => (
  <BackgroundWrapper>
    <Outlet />
  </BackgroundWrapper>
);

export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Add the Education Route */}
        <Route path="/education" element={<EducationPage />} />

        {/* Auth Pages (Centered Layout) */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage role="user" /></RedirectAuthenticatedUser>} />
          <Route path="/signup/seller" element={<RedirectAuthenticatedUser><SignUpPage role="seller" /></RedirectAuthenticatedUser>} />
          <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage role="user" /></RedirectAuthenticatedUser>} />
          <Route path="/login/seller" element={<RedirectAuthenticatedUser><LoginPage role="seller" /></RedirectAuthenticatedUser>} />
          <Route path="/forgot" element={<RedirectAuthenticatedUser><ForgotPasswordPage role="user" /></RedirectAuthenticatedUser>} />
          <Route path="/forgot/seller" element={<RedirectAuthenticatedUser><ForgotPasswordPage role="seller" /></RedirectAuthenticatedUser>} />
          <Route path="/reset/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Route>

        {/* Dashboard Pages (Top-aligned Layout for Navbar) */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}