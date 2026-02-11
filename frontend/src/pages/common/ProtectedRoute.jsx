/**
 * @fileoverview Protected Route Guard (Pages Version) for AgriSahayak
 * 
 * Duplicate of components/common/ProtectedRoute. Restricts access
 * to authenticated users with the specified role. Redirects to /login
 * if unauthenticated, or / if role mismatch.
 * 
 * @component ProtectedRoute
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.role] - Required role ('farmer' or 'buyer')
 * 
 * @see Epic 1, Story 1.1 - Authentication & Authorization
 */
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center font-bold text-emerald-600">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;