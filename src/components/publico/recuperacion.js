import React from 'react';

function Recuperacion() {
  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Recuperación de Contraseña</h1>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              className="form-input"
            />
          </div>

          <div className="form-group flex gap-4 mt-4">
            <button type="submit" className="btn-aceptar">
              Aceptar
            </button>
            <button type="button" className="btn-cancelar">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Recuperacion;
