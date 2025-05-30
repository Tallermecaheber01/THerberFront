import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserInfo, getRole} from '../../api/public';
import { useNavigate } from 'react-router-dom';

function Bienvenida() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para obtener el token de las cookies
  const getTokenFromCookies = () => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='));
    if (!cookie) {
      return null; // No se encontró el token
    }
    const token = cookie.split('=')[1];
    return token ? decodeURIComponent(token) : null;
  };

  useEffect(() => {
    const token = getTokenFromCookies(); // Obtener el token desde la cookie
    if (!token) {
      navigate('/login'); // Redirige al inicio de sesión si no hay token
      return;
    }

    try {
      // Decodificar el token JWT
      const decodedToken = jwtDecode(token);

      // Extraer el id del usuario desde el token
      const { email } = decodedToken;

      // Llamar a la función para obtener la información del usuario
      getUserInfo(email, navigate).then((data) => {
        if (data) {
          setUsuario(data);
          setLoading(false);
          getRole(email).then((role) => {});
        }
      });
    } catch (error) {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleNavigate = () => {
    navigate('/feedback'); // Redirige a la ruta '/feedback'
  };

  return (
    <div className="flex flex-col justify-start items-center pt-20">
      <div className="form-card">
        {usuario ? (
          <>
            <h1 className="detalle-title">¡Bienvenido, {usuario.nombre}!</h1>
            <p className="bienvenida-descripcion">
              Nos alegra verte de nuevo, {usuario.nombre}. ¿Qué deseas hacer
              hoy?
            </p>

            <div className="">
              <h2 className="bienvenida-descripcion">Información de Usuario</h2>
              <p className="bienvenida-descripcion">
                <strong>Nombre:</strong> {usuario.nombre}
              </p>
              <p className="bienvenida-descripcion">
                <strong>Apellido Paterno:</strong> {usuario.apellido_paterno}
              </p>
              <p className="bienvenida-descripcion">
                <strong>Apellido Materno:</strong> {usuario.apellido_materno}
              </p>
              <p className="bienvenida-descripcion">
                <strong>Email:</strong> {usuario.correo}
              </p>
              <p className="bienvenida-descripcion">
                <strong>Teléfono:</strong> {usuario.telefono}
              </p>
            </div>

            <div className="form-group flex gap-4">
              <button onClick={handleNavigate} className="button-yellow">
                Registrar comentario
              </button>
            </div>
          </>
        ) : (
          <p>No se pudo obtener la información del usuario.</p>
        )}
      </div>
    </div>
  );
}

export default Bienvenida;
