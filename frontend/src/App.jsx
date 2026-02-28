/**
 * @fileoverview Root Application Component for AgriSahayak Frontend
 * 
 * This is the top-level React component that assembles the entire application.
 * It sets up the context provider hierarchy, configures client-side routing,
 * and manages the main layout structure (Sidebar + Navbar + Content area).
 * 
 * Architecture Overview:
 * ┌─ App (Root Component) ─────────────────────────────────┐
 * │  AuthProvider → TranslationProvider → LanguageProvider  │
 * │    → SocketProvider → BrowserRouter                     │
 * │      → AppContent (layout + routes)                     │
 * │        ├── Sidebar (role-based navigation, hidden on    │
 * │        │   standalone pages)                             │
 * │        ├── Navbar (user info, language selector, hidden  │
 * │        │   on standalone pages)                          │
 * │        └── Routes (page components)                     │
 * └─────────────────────────────────────────────────────────┘
 * 
 * Page Types:
 * 1. Public Pages: /login, /register (no auth required)
 * 2. Standalone Pages: /negotiation, /buy, /trade (full-screen, no Sidebar/Navbar)
 * 3. Dashboard Pages: /dashboard/farmer, /dashboard/buyer (with Sidebar/Navbar)
 * 4. Protected Pages: Accessible only to users with specific roles (FARMER/BUYER/ADMIN)
 * 
 * @module App
 * @requires react - React library
 * @requires react-router-dom - Client-side routing
 * @requires context/* - All context providers
 * @requires components/layout/* - Sidebar and Navbar
 * @requires pages/* - All page components
 * @requires features/* - Feature-specific components
 */

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ============================================================
// GLOBAL CONTEXT PROVIDERS
// These wrap the entire app to provide global state management.
// Provider order matters: outer providers are accessible by inner providers.
// ============================================================
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import { TranslationProvider } from './context/TranslationContext';

// ============================================================
// LAYOUT & GLOBAL COMPONENTS
// Navbar: Top navigation bar (user info, language selector, notifications)
// Sidebar: Left navigation panel (role-based menu items)
// ProtectedRoute: HOC that guards routes by auth status and role
// ============================================================
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// ============================================================
// AUTHENTICATION COMPONENTS (Epic 1)
// RegisterForm: Multi-step registration with role, language, avatar selection
// LoginForm: Phone + password authentication
// ============================================================
import RegisterForm from './features/auth/components/RegisterForm';
import LoginForm from './features/auth/components/LoginForm';

// ============================================================
// DASHBOARD PAGE COMPONENTS
// Role-specific dashboard views with nested routing
// ============================================================
import FarmerDashboard from './pages/farmer/FarmerDashboard';        // Epic 2: Crop management
import BuyerDashboard from './pages/buyer/BuyerDashboard';          // Epic 3: Marketplace exploration
import ModerationDashboard from './pages/admin/ModerationDashboard'; // Epic 7: Admin moderation

// ============================================================
// SHARED FEATURE COMPONENTS
// Cross-cutting features used across multiple roles
// ============================================================
import VerificationForm from './features/moderation/components/VerificationForm';  // Epic 7: User verification
import PaymentPage from './pages/common/PaymentPage';                    // Epic 4: Payment processing
import TranslationDemo from './pages/common/TranslationDemo';            // Epic 6: Translation demo page
import TradeDashboard from './pages/trade/TradeDashboard';               // Epic 4: Trading hub
import OrderConfirmationPage from './pages/common/OrderConfirmationPage'; // Epic 4: Order confirmation
import TradingDemo from './pages/common/TradingDemo';                    // Epic 4: Trading demo
import FarmerMarketplacePage from './pages/farmer/FarmerMarketplacePage'; // Epic 3: Marketplace view
import NegotiationPage from './pages/trade/NegotiationPage';             // Epic 4: Price negotiation
import BuyNowPaymentPage from './pages/trade/BuyNowPaymentPage';         // Epic 4: Buy now checkout

/**
 * AppContent Component - Main Application Shell
 * 
 * Handles the conditional layout rendering based on:
 * 1. Authentication status (user logged in or not)
 * 2. Current page type (standalone vs dashboard)
 * 
 * Layout logic:
 * - If loading → Shows initialization screen
 * - If standalone page (login, register, negotiation, buy, trade) → No Sidebar/Navbar
 * - If authenticated + dashboard page → Shows Sidebar + Navbar + content area
 * 
 * The Sidebar shifts the content area to the right (lg:pl-80) when visible.
 * 
 * @component
 * @returns {JSX.Element} The main application layout with routes
 */
function AppContent() {
  // Get current user and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);
  // Get current URL path for conditional layout rendering
  const location = useLocation();

  /**
   * Determine if the current page should render without Sidebar/Navbar.
   * Standalone pages include:
   * - /login and /register (authentication pages)
   * - /negotiation/* (full-screen negotiation chat)
   * - /trade (full-screen trade dashboard)
   * - /buy/* (full-screen buy now/payment page)
   */
  const isStandalonePage = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/negotiation') || location.pathname.startsWith('/trade') || location.pathname.startsWith('/buy');

  // Show loading screen while AuthContext checks for stored session
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-black">
        Initializing AgriTech...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50 selection:bg-emerald-500/30">
      {/* ============================================================
          SIDEBAR - Left navigation panel
          Only visible when: user is logged in AND not on a standalone page
          The Sidebar component receives the user's role to show role-specific menu items
          ============================================================ */}
      {user && !isStandalonePage && <Sidebar role={user.role} />}

      {/* Main content area - shifts right when Sidebar is visible */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${user && !isStandalonePage ? 'lg:pl-80' : ''}`}>
        {/* ============================================================
            NAVBAR - Top navigation bar
            Only visible when: user is logged in AND not on a standalone page
            Contains: user info, language selector, notifications
            ============================================================ */}
        {user && !isStandalonePage && <Navbar />}

        {/* Page content area - padding applied when Sidebar/Navbar are visible */}
        <main className={`${user && !isStandalonePage ? 'p-8' : ''} flex-1`}>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            {/* These routes are accessible without authentication */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* ==================== STANDALONE ROUTES ==================== */}
            {/* Full-screen pages without Sidebar/Navbar */}
            {/* Dynamic segments: :negotiationId and :cropId are URL parameters */}
            <Route path="/negotiation/:negotiationId" element={<NegotiationPage />} />
            <Route path="/buy/:cropId" element={<BuyNowPaymentPage />} />

            {/* ==================== SIDEBAR ROUTES ==================== */}
            {/* Pages that render with Sidebar and Navbar */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/demo/translation" element={<TranslationDemo />} />
            <Route path="/demo/trading" element={<TradingDemo />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/trade" element={<TradeDashboard />} />
            <Route path="/marketplace" element={<FarmerMarketplacePage />} />

            {/* ==================== FARMER ROUTES (Epic 2 & 4) ==================== */}
            {/* Protected: Only accessible to users with FARMER role */}
            {/* Wildcard (*) allows nested routing within FarmerDashboard */}
            <Route
              path="/dashboard/farmer/*"
              element={
                <ProtectedRoute role="FARMER">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Farmer Verification Form (Epic 7) */}
            <Route
              path="/profile/verify"
              element={
                <ProtectedRoute role="FARMER">
                  <VerificationForm />
                </ProtectedRoute>
              }
            />

            {/* ==================== BUYER ROUTES (Epic 3 & 4) ==================== */}
            {/* Protected: Only accessible to users with BUYER role */}
            <Route
              path="/dashboard/buyer/*"
              element={
                <ProtectedRoute role="BUYER">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==================== ADMIN ROUTES (Epic 7) ==================== */}
            {/* Protected: Only accessible to users with ADMIN role */}
            <Route
              path="/admin/moderation"
              element={
                <ProtectedRoute role="ADMIN">
                  <ModerationDashboard />
                </ProtectedRoute>
              }
            />

            {/* ==================== DEFAULT REDIRECTS ==================== */}
            {/* Always land on login when opening the app root link */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch-all fallback: redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * App Component - Root of the Application
 * 
 * The outermost component rendered by main.jsx. Sets up the
 * context provider hierarchy that makes global state available
 * to all child components.
 * 
 * Provider hierarchy (outermost → innermost):
 * 1. AuthProvider - Authentication state (user, login, logout)
 * 2. TranslationProvider - Translation functions and language state
 * 3. LanguageProvider - Simple language code state
 * 4. SocketProvider - WebSocket connection (needs AuthContext)
 * 5. BrowserRouter - Client-side routing
 * 
 * The order matters because:
 * - SocketProvider needs AuthContext to know when user is logged in
 * - TranslationProvider needs to be above LanguageProvider
 * - BrowserRouter must wrap all components that use routing hooks
 * 
 * @component
 * @returns {JSX.Element} The complete application wrapped in all providers
 */
export default function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <LanguageProvider>
          <SocketProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </SocketProvider>
        </LanguageProvider>
      </TranslationProvider>
    </AuthProvider>
  );
}