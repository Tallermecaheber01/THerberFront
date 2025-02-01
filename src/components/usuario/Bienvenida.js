import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de usar la importación correcta
import { getUserInfo } from '../../api/client';
import { useNavigate } from 'react-router-dom';

function Bienvenida() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Obtener el token del localStorage
    if (!token) {
      console.log('No se encontró token de autenticación');
      navigate('/login'); // Redirige al inicio de sesión si no hay token
      return;
    }

    try {
      // Decodificar el token JWT
      const decodedToken = jwtDecode(token); // Usar jwtDecode para decodificar el token
      console.log('Contenido del token:', decodedToken); // Mostrar todo el token decodificado

      //Extraer el id del usuario desde el token´
      const { userId } = decodedToken;

      //Llamar a la funcion para obtener la informacion del usuario
      getUserInfo(userId, navigate)
        .then((data) => {
          if (data) {
            setUsuario(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error al obtener la información del usuario:', error);
          setLoading(false);
        });
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

   const handleNavigate = () => {
    navigate('/feedback');  // Redirige a la ruta '/feedback'
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="form-card">
        {usuario ? (
          <>
            <h1 className="detalle-title">¡Bienvenido, {usuario.nombre}!</h1>
            <p className="detalle-descripcion">
              Nos alegra verte de nuevo, {usuario.nombre}. ¿Qué deseas hacer hoy?
            </p>

            <div className="">
              <h2 className="detalle-descripcion">Información del Usuario</h2>
              <p className='detalle-descripcion'><strong>Nombre:</strong> {usuario.nombre}</p>
              <p className='detalle-descripcion'><strong>Apellido Paterno:</strong> {usuario.apellido_paterno}</p>
              <p className='detalle-descripcion'><strong>Apellido Materno:</strong> {usuario.apellido_materno}</p>
              <p className='detalle-descripcion'><strong>Email:</strong> {usuario.correo}</p>
              <p className='detalle-descripcion'><strong>Teléfono:</strong> {usuario.telefono}</p>
            </div>

            <div className="form-group flex gap-4">
              <button
                onClick={handleNavigate}
                className="button-yellow"
              >
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
