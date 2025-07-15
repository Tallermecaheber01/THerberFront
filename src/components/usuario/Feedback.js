import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserInfo } from '../../api/public';
import { getAllServices } from '../../api/admin';
import { sendFeedback } from '../../api/client';
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
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const navigate = useNavigate();

  const getTokenFromCookies = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    if (!cookie) return null;
    return decodeURIComponent(cookie.split('=')[1]);
  };

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

  useEffect(() => {
    getAllServices()
      .then(data => setServicesList(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;
    if (!servicio) return;
    if (rating === 0) {
      setRatingError('Por favor, califica el servicio.');
      return;
    }
    if (!comentario) return;

    const feedbackData = {
      nombre: usuario.nombre,
      servicio,
      comentario,
      calificacion: rating,
    };

    try {
      await sendFeedback(usuario.id, feedbackData);
      toast.success('¡Gracias por tu Comentario!');
      setServicio('');
      setComentario('');
      setRating(0);
      setRatingError('');
    } catch (error) {
      console.error('Error al enviar feedback:', error);
      toast.error('Ocurrió un error al enviar tu comentario.');
    }
  };

  if (loading) return <div>Cargando...</div>;
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
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">Usuario:</label>
              <p className="form-input bg-gray-100 cursor-default">
                {`${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`}
              </p>
            </div>
            {/* Servicio */}
            <div className="form-group">
              <label htmlFor="service-selection" className="form-label">Selección del Servicio</label>
              <select
                id="service-selection"
                className="form-input"
                value={servicio}
                onChange={e => { setServicio(e.target.value); setRating(0); }}
                required
              >
                <option value="" disabled>Selecciona un servicio</option>
                {servicesList.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
              </select>
            </div>
            {/* Estrellas */}
            <div className="form-group">
              <label className="form-label">Calificación</label>
              <div className="flex justify-center space-x-1 text-4xl">
                {[1,2,3,4,5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => { setRating(star); setRatingError(''); }}
                    className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              {ratingError && <p className="text-red-500 text-sm text-center mt-1">{ratingError}</p>}
            </div>
            {/* Comentario */}
            <div className="form-group">
              <label htmlFor="service-comment" className="form-label">Comentario</label>
              <textarea
                id="service-comment"
                className="form-input"
                rows="4"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn-aceptar">Enviar</button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Feedback;