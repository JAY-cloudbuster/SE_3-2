/**
 * @fileoverview Protected Route Guard Component for AgriTech Frontend
 * 
 * Higher-order component that wraps route elements to enforce:
 * 1. Authentication — Redirects unauthenticated users to /login
 * 2. Authorization — Redirects users to their own dashboard if they
 *    attempt to access a route for a different role
 * 
 * Guard logic:
 * - Loading state → Show loading indicator
 * - No user → Redirect to /login
 * - Wrong role → Redirect to /dashboard/{user's role}
 * - Correct role → Render children
 * 
 * @component ProtectedRoute
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected page component
 * @param {string} props.role - Required role: 'FARMER', 'BUYER', or 'ADMIN'
 * 
 * @see Epic 1, Story 1.8 - Role-Based Access Control
 * @see App.jsx - Uses this component to guard dashboard routes
 */
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center font-bold text-emerald-600">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    // Redirect user back to their own dashboard if they hit a different role path
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  return children;
};

export default ProtectedRoute;