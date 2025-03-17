import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getRole } from '../api/public'; 

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, role: 'publico' });

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

        // Primero, establece el usuario sin el rol
        setAuth({
          user: { email: decoded.email },
          role: 'publico', // Valor temporal hasta obtener el rol real
        });

        // Luego, consulta el rol en la base de datos
        getRole(email)
        .then((response) => {
          const newRole = typeof response === 'string' ? response : response.rol;
          setAuth((prevAuth) => ({
            ...prevAuth,
            role: newRole || 'publico', // Actualiza solo el rol
          }));
          })
          .catch((error) => {
            console.error('Error obteniendo el rol:', error);
          });
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
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