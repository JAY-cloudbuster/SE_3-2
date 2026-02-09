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