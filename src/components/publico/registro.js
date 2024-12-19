import React, { useRef } from 'react';

function Registro() {
  const nombreReg = useRef(null);
  const apellidoPaternoReg = useRef(null);
  const apellidoMaternoReg = useRef(null);
  const correoReg = useRef(null);
  const telefonoReg = useRef(null);
  const contrasenaReg = useRef(null);
  const confirmacionContrasenaReg = useRef(null);

  const handleCancelar = () => {
    nombreReg.current.value = '';
    apellidoPaternoReg.current.value = '';
    apellidoMaternoReg.current.value = '';
    correoReg.current.value = '';
    telefonoReg.current.value = '';
    contrasenaReg.current.value = '';
    confirmacionContrasenaReg.current.value = '';
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Registro</h1>
        <form>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              placeholder="Ingresa tu nombre"
              className="form-input"
              ref={nombreReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellidoPaterno" className="form-label">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="apellidoPaterno"
              placeholder="Ingresa tu apellido paterno"
              className="form-input"
              ref={apellidoPaternoReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellidoMaterno" className="form-label">
              Apellido Materno
            </label>
            <input
              type="text"
              id="apellidoMaterno"
              placeholder="Ingresa tu apellido materno"
              className="form-input"
              ref={apellidoMaternoReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              placeholder="Ingresa tu correo"
              className="form-input"
              ref={correoReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              placeholder="Ingresa tu número de teléfono"
              className="form-input"
              ref={telefonoReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              placeholder="Ingresa tu contraseña"
              className="form-input"
              ref={contrasenaReg}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmacionContrasena" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmacionContrasena"
              placeholder="Confirma tu contraseña"
              className="form-input"
              ref={confirmacionContrasenaReg}
            />
          </div>

          <div className="form-group flex gap-4 mt-4">
            <button type="submit" className="btn-aceptar">
              Aceptar
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
