import React, { useState } from 'react';
import Breadcrumbs from "../Breadcrumbs";

function HistorialReparaciones() {
  const [filtroVehiculoID, setFiltroVehiculoID] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTipoReparacion, setFiltroTipoReparacion] = useState('');
  const [reparaciones] = useState([
    { id: 'V123', tipo: 'Cambio de Aceite', fecha: '2024-12-01', costo: 50, cliente: 'Juan Pérez' },
    { id: 'V456', tipo: 'Revisión General', fecha: '2024-11-15', costo: 70, cliente: 'María García' },
    { id: 'V789', tipo: 'Cambio de Neumáticos', fecha: '2024-10-20', costo: 200, cliente: 'Carlos López' }
  ]);

  const handleBuscarReparaciones = () => {
    return reparaciones.filter((reparacion) => (
      (!filtroVehiculoID || reparacion.id.toLowerCase().includes(filtroVehiculoID.toLowerCase())) &&
      (!filtroFecha || reparacion.fecha.includes(filtroFecha)) &&
      (!filtroTipoReparacion || reparacion.tipo.toLowerCase().includes(filtroTipoReparacion.toLowerCase()))
    ));
  };

  const reparacionesFiltradas = handleBuscarReparaciones();

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" }, // Ruta al inicio
    { name: "Historial Reparaciones", link: "/historialreperaciones" }, // Ruta al login
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
    <div className="citasContainer">
      <form className="citasForm flex flex-col">
        <h1 className="form-title text-center">Consultar Historial de Reparaciones</h1>

        <div className="divFiltros">
          <div className="form-group">
            <label htmlFor="filtroVehiculoID" className="form-label">Filtrar por ID del Vehículo</label>
            <input
              id="filtroVehiculoID"
              type="text"
              className="form-input"
              value={filtroVehiculoID}
              onChange={(e) => setFiltroVehiculoID(e.target.value)}
              placeholder="ID del vehículo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="filtroFecha" className="form-label">Filtrar por Fecha</label>
            <input
              id="filtroFecha"
              type="date"
              className="form-input"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="filtroTipoReparacion" className="form-label">Filtrar por Tipo de Reparación</label>
            <input
              id="filtroTipoReparacion"
              type="text"
              className="form-input"
              value={filtroTipoReparacion}
              onChange={(e) => setFiltroTipoReparacion(e.target.value)}
              placeholder="Tipo de reparación"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="cita-title text-center">Reparaciones Realizadas</h2>
          {reparacionesFiltradas.length > 0 ? (
            <div className="cardCitas ">
              {reparacionesFiltradas.map((reparacion, index) => (
                <div key={index} className="reparacion-card card-transition">
                  <div className="mb-4">
                    <span className="detalle-label">ID Vehículo: </span>
                    <span className="detalle-costo">{reparacion.id}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Tipo de Reparación: </span>
                    <span className="detalle-costo">{reparacion.tipo}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Fecha: </span>
                    <span className="detalle-costo">{reparacion.fecha}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Costo: </span>
                    <span className="detalle-costo">${reparacion.costo}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="advertencia">No se encontraron reparaciones con los filtros aplicados.</p>
          )}
        </div>
      </form>
    </div>
    </div>
  );
}

export default HistorialReparaciones;
