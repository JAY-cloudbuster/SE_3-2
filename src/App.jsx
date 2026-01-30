import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout & Global Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Feature Components (EPIC 1 & 2)
import RegisterForm from './features/auth/components/RegisterForm';
import LoginForm from './features/auth/components/LoginForm';

// Dashboard Pages (EPIC 2, 3, 4, 5, 7)
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ModerationDashboard from './pages/admin/ModerationDashboard';

// Shared Features
import VerificationForm from './features/moderation/components/VerificationForm';
import PaymentPage from './pages/common/PaymentPage';

/**
 * Main Content Shell
 * This handles the conditional rendering of the Sidebar and Navbar 
 * once the user is authenticated.
 */
function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-black">
        Initializing AgriTech...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50 selection:bg-emerald-500/30">
      {/* Sidebar appears only when logged in (Story 1.8) */}
      {user && <Sidebar role={user.role} />}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${user ? 'lg:pl-80' : ''}`}>
        {/* Navbar appears only when logged in (Story 1.10) */}
        {user && <Navbar />}

        <main className={`${user ? 'p-8' : ''} flex-1`}>
          <Routes>
            {/* --- Public Access --- */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* --- Standalone Pages --- */}
            <Route path="/payment" element={<PaymentPage />} />

            {/* --- Farmer Dashboard (EPIC 2 & 4) --- */}
            <Route
              path="/dashboard/farmer/*"
              element={
                <ProtectedRoute role="FARMER">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/verify"
              element={
                <ProtectedRoute role="FARMER">
                  <VerificationForm />
                </ProtectedRoute>
              }
            />

            {/* --- Buyer Dashboard (EPIC 3 & 4) --- */}
            <Route
              path="/dashboard/buyer/*"
              element={
                <ProtectedRoute role="BUYER">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            {/* --- Admin Moderation (EPIC 7) --- */}
            <Route
              path="/admin/moderation"
              element={
                <ProtectedRoute role="ADMIN">
                  <ModerationDashboard />
                </ProtectedRoute>
              }
            />

            {/* --- Automatic Redirects --- */}
            <Route
              path="/"
              element={
                user
                  ? <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />
                  : <Navigate to="/register" replace />
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * Root Component
 * Injects all required providers for the complete platform.
 */
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}