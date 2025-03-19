import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useContext(AuthContext);

  // Mientras se verifica el estado de autenticación, mostramos un loading
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  // Si no hay usuario autenticado, redirige al login
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario está permitido
  if (
    allowedRoles &&
    !allowedRoles
      .map(role => String(role).toLowerCase())
      .includes(String(auth.role).toLowerCase())
  ) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
