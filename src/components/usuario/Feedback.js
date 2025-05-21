import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserInfo } from '../../api/public';
import { getAllServices } from '../../api/admin';
import { sendFeedback } from '../../api/users';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

function Feedback() {
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Comentarios', link: '/feedback' },
  ];

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [servicio, setServicio] = useState('');
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();

  // Extrae el JWT desde la cookie
  const getTokenFromCookies = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    if (!cookie) return null;
    return decodeURIComponent(cookie.split('=')[1]);
  };

  // Al montar, verifica sesión y obtiene datos de usuario
  useEffect(() => {
    const token = getTokenFromCookies();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { email } = jwtDecode(token);
      getUserInfo(email, navigate).then(data => {
        setUsuario(data || null);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
  }, [navigate]);

  // Al montar, obtiene la lista de servicios para el select
  useEffect(() => {
    getAllServices()
      .then(data => setServicesList(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return; // seguridad extra

    if (!servicio || !comentario) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    const feedbackData = {
      nombre: usuario.nombre,
      servicio,
      comentario,
    };

    try {
      await sendFeedback(feedbackData);
      toast.success('¡Gracias por tu Comentario!');
      setServicio('');
      setComentario('');
    } catch {
      toast.error('Ocurrió un error al enviar tu comentario.');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!usuario) {
    return (
      <div className="flex flex-col items-center pt-20">
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="form-card text-center">
          <p className="bienvenida-descripcion">
            Debes <Link to="/login" className="text-blue-600 underline">iniciar sesión</Link> para dejar un comentario.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Feedback del Servicio</h1>
          <form onSubmit={handleSubmit}>
            {/* Nombre del cliente */}
            <div className="form-group">
              <label className="form-label">Usuario:</label>
              <p className="form-input bg-gray-100 cursor-default">
                {`${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`}
              </p>
            </div>

            {/* Selección del servicio */}
            <div className="form-group">
              <label htmlFor="service-selection" className="form-label">
                Selección del Servicio
              </label>
              <select
                id="service-selection"
                className="form-input"
                value={servicio}
                onChange={e => setServicio(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona un servicio</option>
                {servicesList.map(s => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Comentario sobre el servicio */}
            <div className="form-group">
              <label htmlFor="service-comment" className="form-label">
                Comentario sobre el Servicio
              </label>
              <textarea
                id="service-comment"
                className="form-input"
                rows="4"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escribe tus comentarios aquí"
                required
              />
            </div>

            {/* Botón enviar */}
            <div className="form-group">
              <button type="submit" className="btn-aceptar">
                Enviar
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Feedback;
