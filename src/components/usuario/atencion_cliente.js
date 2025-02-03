import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function AtencionCliente() {
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    mensaje: "",
  });

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" }, // Ruta al inicio
    { name: "Atencion Cliente", link: "/atencioncliente" }, // Ruta al login
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      contacto: "",
      mensaje: "",
    });
    console.log("Formulario limpiado");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <div>
       <Breadcrumbs paths={breadcrumbPaths} /> 
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Atención al Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre del Cliente
            </label>
            <input
              type="text"
              id="nombre"
              className="form-input"
              placeholder="Ingresa tu nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contacto" className="form-label">
              Correo o Teléfono
            </label>
            <input
              type="text"
              id="contacto"
              className="form-input"
              placeholder="Ingresa tu correo o teléfono"
              value={formData.contacto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje" className="form-label">
              Contenido del Mensaje
            </label>
            <textarea
              id="mensaje"
              className="form-input"
              placeholder="Escribe tu mensaje aquí"
              rows="4"
              value={formData.mensaje}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group flex gap-4">
            <button type="submit" className="btn-aceptar">
              Enviar
            </button>
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AtencionCliente;
