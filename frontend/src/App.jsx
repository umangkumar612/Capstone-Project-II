import React from "react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ScanAnalysisPage from "./pages/ScanAnalysisPage.jsx";

export default function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#f6fbff] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 medical-grid opacity-80 dark:opacity-20" />
      <div className="pointer-events-none fixed left-[-10rem] top-[-10rem] h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-12rem] right-[-8rem] h-96 w-96 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="relative">
        <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((value) => !value)} />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage notify={setToast} />} />
            <Route path="/patient" element={<ProtectedRoute roles={["patient", "doctor", "admin"]}><PatientDashboard notify={setToast} /></ProtectedRoute>} />
            <Route path="/doctor" element={<ProtectedRoute roles={["doctor", "admin"]}><DoctorDashboard notify={setToast} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute roles={["patient", "doctor", "admin"]}><ScanAnalysisPage /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute roles={["patient", "doctor", "admin"]}><ReportPage notify={setToast} /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="mx-auto max-w-7xl px-5 py-16 font-black text-cyan-700">Checking session...</div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/patient"} replace />;
  }
  return children;
}
