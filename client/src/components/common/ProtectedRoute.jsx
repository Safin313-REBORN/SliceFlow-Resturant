import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-brand-grey">Authenticating SliceFlow session...</p>
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

