import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// USER store
import { useAuthStore } from "./store/authStore";

// SELLER store
import { useSellerAuthStore } from "./seller/store/sellerAuthStore";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import LoadingSpinner from "./components/LoadingSpinner";

// Public Homepage
import HomePage from "./pages/HomePage";

// USER pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerification from "./pages/EmailVerification";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserDashboard from "./pages/UserDashboard";

// SELLER pages
import SellerLogin from "./seller/pages/SellerLogin";
import SellerSignup from "./seller/pages/SellerSignup";
import SellerEmailVerification from "./seller/pages/SellerEmailVerification";
import SellerForgotPassword from "./seller/pages/SellerForgotPassword";
import SellerResetPassword from "./seller/pages/SellerResetPassword";
import SellerDashboard from "./seller/pages/SellerDashboard";

// USER Protected Route
const UserProtected = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

// SELLER Protected Route
const SellerProtected = ({ children }) => {
  const { isAuthenticated, seller } = useSellerAuthStore();
  if (!isAuthenticated) return <Navigate to="/seller/login" replace />;
  if (!seller?.isVerified) return <Navigate to="/seller/verify-email" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const { isCheckingSellerAuth, checkSellerAuth } = useSellerAuthStore();

  useEffect(() => {
    checkAuth();
    checkSellerAuth();
  }, []);

  if (isCheckingAuth || isCheckingSellerAuth) return <LoadingSpinner />;

  return (
    <Routes>

      {/* PUBLIC HOME PAGE */}
      <Route path="/" element={<HomePage />} />

      {/* USER AUTH ROUTES */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />
      <Route path="/verify-email" element={<AuthLayout><EmailVerification /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
      <Route path="/reset-password/:token" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

      {/* USER DASHBOARD */}
      <Route path="/user/dashboard" element={
        <UserProtected>
          <UserDashboard />
        </UserProtected>
      } />

      {/* SELLER AUTH ROUTES */}
      <Route path="/seller/login" element={<AuthLayout><SellerLogin /></AuthLayout>} />
      <Route path="/seller/signup" element={<AuthLayout><SellerSignup /></AuthLayout>} />
      <Route path="/seller/verify-email" element={<AuthLayout><SellerEmailVerification /></AuthLayout>} />
      <Route path="/seller/forgot-password" element={<AuthLayout><SellerForgotPassword /></AuthLayout>} />
      <Route path="/seller/reset-password/:token" element={<AuthLayout><SellerResetPassword /></AuthLayout>} />

      {/* SELLER DASHBOARD */}
      <Route path="/seller/dashboard" element={
        <SellerProtected>
          <SellerDashboard />
        </SellerProtected>
      } />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App; 