import FloatingShape from "./components/FloatingShape.jsx";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";

function App() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-emerald-900">
      {/* Floating Glows */}
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

      <Routes>
        <Route path='/' element={"Home"}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/verify-email' element={<EmailVerification/>}/>
      </Routes>
    </div>
  );
}

export default App;
