import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/403" replace />;
  }
  return children;
};

export default ProtectedRoute;
