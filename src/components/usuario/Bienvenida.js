import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserInfo, getRole } from '../../api/public';
import { useNavigate } from 'react-router-dom';
import { generateSmartwatchCode } from '../../api/client';

function Bienvenida() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [codigoSmartwatch, setCodigoSmartwatch] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [lastGenTime, setLastGenTime] = useState(null);
  const navigate = useNavigate();

  
  const TOKEN_DURATION = 10 * 60 * 1000;

  const getTokenFromCookies = () => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='));
    if (!cookie) return null;
    const token = cookie.split('=')[1];
    return token ? decodeURIComponent(token) : null;
  };

  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const { email } = decodedToken;

      getUserInfo(email, navigate)
        .then((data) => {
          if (data) {
            setUsuario(data);
            return getRole(email);
          }
          throw new Error('No se obtuvo información de usuario');
        })
        .then((rolObj) => {
          const rolString = typeof rolObj === 'object' && rolObj.rol ? rolObj.rol : rolObj;
          setRole(rolString);
        })
        .catch((err) => console.error('Error en userInfo/getRole:', err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error('Error al decodificar token:', error);
      setLoading(false);
    }
  }, [navigate]);

  const canGenerate = !lastGenTime || (Date.now() - lastGenTime) > TOKEN_DURATION;

  const handleVincularSmartwatch = async () => {
    if (!usuario?.id || !canGenerate) return;
    setGenerando(true);
    try {
      const codigo = await generateSmartwatchCode(usuario.id);
      setCodigoSmartwatch(codigo);
      setLastGenTime(Date.now());
    } catch (error) {
      alert('Error al generar el código para el smartwatch');
      console.error(error);
    } finally {
      setGenerando(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col justify-start items-center pt-20">
      <div className="form-card">
        {usuario ? (
          <>
            <h1 className="detalle-title">¡Bienvenido, {usuario.nombre}!</h1>
            <p className="bienvenida-descripcion">
              Nos alegra verte de nuevo, {usuario.nombre}. ¿Qué deseas hacer hoy?
            </p>

            <div>
              <h2 className="bienvenida-descripcion">Información de Usuario</h2>
              <p className="bienvenida-descripcion"><strong>Nombre:</strong> {usuario.nombre}</p>
              <p className="bienvenida-descripcion"><strong>Apellido Paterno:</strong> {usuario.apellido_paterno}</p>
              <p className="bienvenida-descripcion"><strong>Apellido Materno:</strong> {usuario.apellido_materno}</p>
              <p className="bienvenida-descripcion"><strong>Email:</strong> {usuario.correo}</p>
              <p className="bienvenida-descripcion"><strong>Teléfono:</strong> {usuario.telefono}</p>
            </div>

            {role === 'cliente' && (
              <div className="form-group flex flex-col items-center gap-4 mt-20">
                <p className="text-center text-green-800 dark:text-green-200 font-medium text-xl">
                  Vincular tu smartwatch para recibir notificaciones:
                </p>
                <button
                  onClick={handleVincularSmartwatch}
                  className="btn-blue"
                  disabled={generando || !canGenerate}
                >
                  {generando
                    ? 'Generando código...'
                    : canGenerate
                    ? 'Generar código'
                    : 'Espera 10 minutos para generar un nuevo código'}
                </button>

                {codigoSmartwatch && (
                  <div className="mt-2 text-black-800 dark:text-white text-center font-bold text-lg">
                    Código: {codigoSmartwatch}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p>No se pudo obtener la información del usuario.</p>
        )}
      </div>
    </div>
  );
}

export default Bienvenida;
