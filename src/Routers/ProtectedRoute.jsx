import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, publicOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (publicOnly && isAuthenticated) {
    return <Navigate to="/Principal" replace state={{ from: location }} />;
  }

  if (!publicOnly) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/Principal" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;