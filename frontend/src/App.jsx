import FloatingShape from "./components/FloatingShape.jsx";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import DashBoard from "./components/DashBoard.jsx";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// ✅ Protected route for authenticated users only
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// ✅ Redirect users who are already logged in
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check auth on mount
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-emerald-900">
      {/* Floating Backgrounds */}
      <FloatingShape
        color="bg-green-400"
        size="w-72 h-72"
        top="-10%"
        left="15%"
        delay={0}
        duration={12}
        opacity="opacity-20"
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-56 h-56"
        top="20%"
        left="70%"
        delay={2}
        duration={10}
        opacity="opacity-25"
      />
      <FloatingShape
        color="bg-lime-400"
        size="w-64 h-64"
        top="65%"
        left="25%"
        delay={4}
        duration={14}
        opacity="opacity-15"
      />
      <FloatingShape
        color="bg-green-300"
        size="w-80 h-80"
        top="40%"
        left="-10%"
        delay={6}
        duration={18}
        opacity="opacity-10"
      />
      <FloatingShape
        color="bg-teal-500"
        size="w-48 h-48"
        top="80%"
        left="70%"
        delay={8}
        duration={16}
        opacity="opacity-20"
      />

      {/* Routes */}
      <Routes>
        {/* Default route → redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login route */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* After signup → verify email */}
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* After login → Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
