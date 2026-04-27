import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  requiredRoles = [], 
  userRole = null,
  redirectPath = '/login',
  require2FA = false,
  is2FAVerified = false
}) => {
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if 2FA is required but not verified
  if (require2FA && !is2FAVerified) {
    return <Navigate to="/verify-2fa" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

// HOC for protecting components
export const withProtection = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Component for unauthorized access page
export const UnauthorizedPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-red-600 mb-5">🚫 Access Denied</h1>
        <p className="text-gray-600 mb-2">You don't have permission to access this page.</p>
        <p className="text-gray-600 mb-2">Please contact your administrator if you believe this is a mistake.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-5 px-5 py-2 bg-blue-600 text-white border-none rounded cursor-pointer transition-colors hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProtectedRoute;
