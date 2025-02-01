import React, { useState } from 'react';
import { sendFeedback } from '../../api/users';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function Feedback() {
  const [nombre, setNombre] = useState('');
  const [servicio, setServicio] = useState('');
  const [comentario, setComentario] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegúrate de que todos los campos estén completos
    if (!nombre || !servicio || !comentario) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    // Verificar si 'nombre' es un número o texto
    const processedNombre = isNaN(nombre) ? nombre : Number(nombre); // Si es un número, lo convertimos

    const feedbackData = {
      nombre: processedNombre, // Aquí ya será un número o un texto, según corresponda
      servicio,     // Coincide con la columna 'servicio'
      comentario,   // Coincide con la columna 'comentario'
    };

    console.log('Datos enviados:', feedbackData);  // Verifica que los datos sean correctos

    try {
      const response = await sendFeedback(feedbackData);  // Envías los datos a la API
      console.log("Respuesta del servidor:", response); // Imprime la respuesta completa para ver su estructura
      toast.success('¡Gracias por tu Comentario!');
      setNombre('');       // Limpiar el campo de nombre
      setServicio('');     // Limpiar el campo de servicio
      setComentario('');   // Limpiar el campo de comentario
    } catch (error) {
      if (error.response.data.statusCode === 400) {
        toast.error("Hubo un error al procesar los datos.");
        toast.error('Ocurrió un error al enviar tu feedback. Inténtalo nuevamente.');
        toast.error("Datos no validos");
        setTimeout(() => {
          navigate("/400");
        }, 3000); // 3000 ms = 3 segundos

      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Feedback del Servicio</h1>
        <form onSubmit={handleSubmit}>
          {/* Nombre del cliente */}
          <div className="form-group">
            <label htmlFor="client-name" className="form-label">
              Nombre del Cliente
            </label>
            <input
              type="text"
              id="client-name"
              name="client-name"
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}  // Se mantiene el valor como texto
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          {/* Selección del servicio */}
          <div className="form-group">
            <label htmlFor="service-selection" className="form-label">
              Selección del Servicio
            </label>
            <select
              id="service-selection"
              name="service-selection"
              className="form-input"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}  // Asegúrate de que se guarde el servicio
              required
            >
              <option value="" disabled>
                Selecciona un servicio
              </option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparacion">Reparación</option>
              <option value="diagnostico">Diagnóstico</option>
            </select>
          </div>

          {/* Comentario sobre el servicio */}
          <div className="form-group">
            <label htmlFor="service-comment" className="form-label">
              Comentario sobre el Servicio
            </label>
            <textarea
              id="service-comment"
              name="service-comment"
              className="form-input"
              rows="4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}  // Asegúrate de que se guarde el comentario
              placeholder="Escribe tus comentarios aquí"
              required
            ></textarea>
          </div>

          {/* Botones */}
          <div className="form-group">
            <button type="submit" className="btn-aceptar">
              Enviar
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Feedback;
