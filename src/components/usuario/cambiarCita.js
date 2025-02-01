import React, { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs'; 

function CambiarCita() {
  const [fecha, setFecha] = useState('2024-12-22T14:30'); 
  const [total, setTotal] = useState(240); 
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({
    cambioAceite: true,
    revisionGeneral: true,
    reparacionFrenos: true,
  }); 
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [motivo, setMotivo] = useState('');

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Cita', link: '/consultacita' },
    { name: 'Editar Cita', link: '/editarcita' },
  ];

  const servicios = [
    { nombre: 'Cambio de Aceite', precio: 50, clave: 'cambioAceite' },
    { nombre: 'Revisión General', precio: 70, clave: 'revisionGeneral' },
    { nombre: 'Reparación de Frenos', precio: 90, clave: 'reparacionFrenos' },
    { nombre: 'Alineación de Ruedas', precio: 80, clave: 'alineacionRuedas' },
    { nombre: 'Cambio de Filtro de Aire', precio: 40, clave: 'cambioFiltroAire' },
    { nombre: 'Reparación de Suspensión', precio: 100, clave: 'reparacionSuspension' },
    { nombre: 'Reemplazo de Batería', precio: 120, clave: 'reemplazoBateria' },
    { nombre: 'Reparación de Radiador', precio: 150, clave: 'reparacionRadiador' },
    { nombre: 'Cambio de Neumáticos', precio: 200, clave: 'cambioNeumaticos' },
    { nombre: 'Cambio de Frenos', precio: 110, clave: 'cambioFrenos' },
  ];

  const manejarCambio = (e) => {
    const { name, checked } = e.target;

    setServiciosSeleccionados((prev) => {
      const nuevosServicios = { ...prev };
      if (checked) {
        nuevosServicios[name] = checked;
      } else {
        delete nuevosServicios[name]; 
      }
      calcularTotal(nuevosServicios);
      return nuevosServicios;
    });
  };

  const calcularTotal = (nuevosServicios) => {
    let nuevoTotal = 0;
    for (const servicio in nuevosServicios) {
      if (nuevosServicios[servicio]) {
        const servicioSeleccionado = servicios.find((s) => s.clave === servicio);
        nuevoTotal += servicioSeleccionado ? servicioSeleccionado.precio : 0;
      }
    }
    setTotal(nuevoTotal);
  };

  const manejarFechaCambio = (e) => {
    setFecha(e.target.value);
  };

  const manejarMotivoCambio = (e) => {
    setMotivo(e.target.value);
  };

  const manejarEnviar = (e) => {
    e.preventDefault();
    console.log('Cita cambiada', { fecha, serviciosSeleccionados, total, motivo });
  };

  return (
    <div className="form-container">
      {/* Breadcrumbs fuera del formulario */}
      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="form-card">
        <h2 className="form-title">Cambiar Cita en el Taller Mecánico</h2>
        <form onSubmit={manejarEnviar}>
          <div className="form-group">
            <label htmlFor="fecha" className="form-label">Fecha y Hora de la Cita Actual</label>
            <input
              type="datetime-local"
              id="fecha"
              name="fecha"
              value={fecha}
              onChange={manejarFechaCambio}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Servicios Seleccionados</label>
            <div className="space-y-4">
              {Object.keys(serviciosSeleccionados).length > 0 ? (
                Object.keys(serviciosSeleccionados).map((servicioClave) => {
                  const servicio = servicios.find(s => s.clave === servicioClave);
                  return (
                    <div key={servicio.clave} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        name={servicio.clave}
                        checked={serviciosSeleccionados[servicio.clave]}
                        onChange={manejarCambio}
                        className="form-checkbox"
                      />
                      <div>
                        <h3 className="cita-title">{servicio.nombre}</h3>
                        <p className="cita-subtitle">Precio: ${servicio.precio}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No hay servicios seleccionados.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMostrarServicios(!mostrarServicios)}
              className="button-yellow"
            >
              {mostrarServicios ? 'Ocultar Servicios' : 'Agregar Más Servicios'}
            </button>
          </div>

          {mostrarServicios && (
            <div className="form-group">
              <label className="form-label">Seleccione los Servicios Requeridos</label>
              <div className="space-y-4">
                {servicios.map((servicio) => {
                  const isSelected = serviciosSeleccionados[servicio.clave] || false;
                  return (
                    <label key={servicio.clave} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        name={servicio.clave}
                        checked={isSelected}
                        onChange={manejarCambio}
                        className="form-checkbox"
                      />
                      <div>
                        <h3 className="cita-title">{servicio.nombre}</h3>
                        <p className="cita-subtitle">Precio: ${servicio.precio}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="motivo" className="form-label">Motivo del Cambio (Opcional)</label>
            <textarea
              id="motivo"
              name="motivo"
              value={motivo}
              onChange={manejarMotivoCambio}
              className="form-input"
              placeholder="Escribe el motivo del cambio"
            />
          </div>

          <div className="form-group">
            <label htmlFor="total" className="form-label">Total</label>
            <input
              type="text"
              id="total"
              name="total"
              value={`$${total}`}
              className="form-input"
              disabled
            />
          </div>

          <div className='mt-4'>
              <div className="form-footer">
                <button type="submit" className="btn-aceptar">Cambiar Cita</button>
              </div>
              <div className="form-footer mt-1">
                <button type="button" className="btn-cancelar" onClick={() => window.location.reload()}>Cancelar</button>
              </div>
         </div>
        </form>
      </div>
    </div>
  );
}

export default CambiarCita;
