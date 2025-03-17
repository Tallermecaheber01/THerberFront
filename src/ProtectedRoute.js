import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useContext(AuthContext);

  // Si no hay usuario autenticado, redirige al login.
  if (!auth || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  // Mientras el rol sigue siendo 'publico' (valor inicial), podemos mostrar un indicador de carga.
  if (auth.role === 'publico') {
    return <div>Loading...</div>;
  }
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

