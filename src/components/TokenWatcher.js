import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const TokenWatcher = () => {
  const { updateAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de rutas públicas donde no queremos redirigir a /login
  const publicRoutes = [
    '/', 
    '/login', 
    '/registro', 
    '/consultaservicios', 
    '/recuperacion',
    'verDetalles/:id',
    '/acercade', 
    '/politicadeprivacidad', 
    '/terminosycondiciones', 
    '/validacioncuenta', 
    '/Marcas',
    '/NotFound',
    '/500',
    '/403',
    '/400',
    '/demandas'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenExists = document.cookie
        .split("; ")
        .some(row => row.startsWith("authToken="));
      if (!tokenExists) {
        updateAuth(); // Actualiza el estado a público
        // Si la ruta actual NO es una ruta pública, redirige a /login
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
        clearInterval(interval);
      }
    }, 1000); // Comprueba cada segundo

    return () => clearInterval(interval);
  }, [updateAuth, navigate, location.pathname]);

  return null;
};

export default TokenWatcher;

