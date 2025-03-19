import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getRole } from '../api/public';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, role: 'publico', loading: true });

  const updateAuth = () => {
    const getCookie = (name) => {
      const matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
          '=([^;]*)'
        )
      );
      return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const token = getCookie('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded);
        const email = decoded.email;

        // Establecemos el usuario temporalmente y mantenemos loading en true
        setAuth({
          user: { id: decoded.userId, email: decoded.email },
          role: 'publico', // valor temporal
          loading: true,
        });

        // Consulta el rol en la base de datos
        getRole(email)
          .then((response) => {
            const newRole = typeof response === 'string' ? response : response.rol;
            setAuth({
              user: { id: decoded.userId, email: decoded.email },
              role: newRole || 'publico',
              loading: false, // finaliza la carga
            });
          })
          .catch((error) => {
            console.error('Error obteniendo el rol:', error);
            setAuth({ user: null, role: 'publico', loading: false });
          });
      } catch (error) {
        console.error('Error decodificando el token:', error);
        setAuth({ user: null, role: 'publico', loading: false });
      }
    } else {
      // Si no hay token, actualiza el estado a "público" y finaliza la carga
      setAuth({ user: null, role: 'publico', loading: false });
    }
  };

  useEffect(() => {
    updateAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

