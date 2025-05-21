import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Breadcrumbs';

function CambiarCita() {
  const [fechaActual] = useState('2024-12-22T14:30');
  const [nuevaFecha, setNuevaFecha] = useState('2024-12-22T14:30');
  const [motivo, setMotivo] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({
    cambioAceite: true,
    revisionGeneral: true,
    reparacionFrenos: true,
  });

  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [busquedaServicio, setBusquedaServicio] = useState('');

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Cita', link: '/consultacita' },
    { name: 'Editar Cita', link: '/editarcita' },
  ];

  const servicios = [
    { nombre: 'Cambio de Aceite', clave: 'cambioAceite' },
    { nombre: 'Revisión General', clave: 'revisionGeneral' },
    { nombre: 'Reparación de Frenos', clave: 'reparacionFrenos' },
    { nombre: 'Alineación de Ruedas', clave: 'alineacionRuedas' },
    { nombre: 'Cambio de Filtro de Aire', clave: 'cambioFiltroAire' },
    { nombre: 'Reparación de Suspensión', clave: 'reparacionSuspension' },
    { nombre: 'Reemplazo de Batería', clave: 'reemplazoBateria' },
    { nombre: 'Reparación de Radiador', clave: 'reparacionRadiador' },
    { nombre: 'Cambio de Neumáticos', clave: 'cambioNeumaticos' },
    { nombre: 'Cambio de Frenos', clave: 'cambioFrenos' },
  ];

  // Toggle servicio
  const manejarServicioToggle = clave => {
    setServiciosSeleccionados(prev => ({
      ...prev,
      [clave]: !prev[clave] // Invertir valor boolean
    }));
  };

  const manejarNuevaFechaChange = e => setNuevaFecha(e.target.value);
  const manejarMotivoChange    = e => setMotivo(e.target.value);

  const manejarEnviar = e => {
    e.preventDefault();
    console.log({
      fechaActual,
      nuevaFecha,
      motivo,
      servicios: Object.keys(serviciosSeleccionados)
    });
    // pal back
  };

  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  // Array estable de seleccionados
  const seleccionados = servicios.filter(s => serviciosSeleccionados[s.clave]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Fecha inválida' 
      : date.toLocaleString('es-ES');
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs paths={breadcrumbPaths} />

      <form onSubmit={manejarEnviar} className="form-card p-6 max-w-6xl mx-auto">
        <h2 className="form-title mb-6">Solicitar Cambio de Cita</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {/* Fecha actual */}
            <div className="form-group">
              <label className="form-label">Fecha y Hora Actual</label>
              <p className="cita-subtitle">
                {new Date(fechaActual).toLocaleString()}
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Trabajador Asignado</label>
              <p className="cita-subtitle">Juan Pérez</p>
            </div>
            <div className="form-group">
              <label htmlFor="nueva-fecha" className="form-label">
                Nueva Fecha y Hora
              </label>
              <input
                id="nueva-fecha"
                type="datetime-local"
                value={nuevaFecha}
                onChange={manejarNuevaFechaChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="motivo" className="form-label">
                Motivo (Opcional)
              </label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={manejarMotivoChange}
                className="form-input"
                placeholder="Describe el motivo del cambio"
              />
            </div>
            <button
              type="button"
              onClick={() => setMostrarServicios(!mostrarServicios)}
              className="button-yellow mt-2"
            >
              {mostrarServicios ? 'Ocultar Servicios' : 'Agregar Servicios'}
            </button>
            {mostrarServicios && (
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  value={busquedaServicio}
                  onChange={e => setBusquedaServicio(e.target.value)}
                  className="form-input"
                />
                {serviciosFiltrados.map(srv => {
                  const checked = !!serviciosSeleccionados[srv.clave];
                  return (
                    <label key={srv.clave} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => manejarServicioToggle(srv.clave)}
                        className="form-checkbox"
                      />
                      <span>{srv.nombre}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="space-y-6">
          <div key={`fecha-${nuevaFecha}`} className="p-4 bg-gray-50 rounded space-y-2">
              <h3 className="font-semibold">Resumen de Cambio</h3>
              <p>
                <strong>Fecha Actual:</strong>{' '}
                {new Date(fechaActual).toLocaleString()}
              </p>
              <div className="debug-border">
    
              <p><strong>Nueva Fecha:</strong> {formatDate(nuevaFecha)}</p>
            </div>
            <p key={motivo}><strong>Motivo:</strong> {motivo || '—'}</p>
              <div>
                <strong>Servicios:</strong>
                {seleccionados.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {seleccionados.map(srv => (
                      <li key={srv.clave} className="flex justify-between">
                        {srv.nombre}
                        <button
                          type="button"
                          onClick={() => manejarServicioToggle(srv.clave)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> Ninguno</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-aceptar py-1 flex-1">
                Confirmar Cambio
              </button>
              <button
                type="button"
                className="btn-cancelar py-1 flex-1"
                onClick={() => window.location.reload()}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CambiarCita;









