import React, { useState } from 'react';

function ConsultarCitas() {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('');
  const [citas, setCitas] = useState([
    { id: 1, cliente: 'Juan Pérez', servicio: 'Cambio de aceite', fecha: '2025-01-05', hora: '10:00' },
    { id: 2, cliente: 'María Gómez', servicio: 'Revisión general', fecha: '2025-01-06', hora: '12:00' },
    { id: 3, cliente: 'Carlos López', servicio: 'Cambio de llantas', fecha: '2025-01-05', hora: '14:00' },
  ]);

  const handleBuscarCitas = () => {
    const citasFiltradas = citas.filter((cita) => {
      return (
        (!filtroFecha || cita.fecha === filtroFecha) &&
        (!filtroCliente || cita.cliente.toLowerCase().includes(filtroCliente.toLowerCase())) &&
        (!filtroServicio || cita.servicio.toLowerCase().includes(filtroServicio.toLowerCase()))
      );
    });
    return citasFiltradas;
  };

  const citasFiltradas = handleBuscarCitas();

  return (
    <div className="citasContainer">
      <form className="citasForm flex flex-col ">
        <h1 className="form-title text-center">Consultar Citas Próximas</h1>

        <div className="divFiltros">
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
            <label htmlFor="filtroCliente" className="form-label">Filtrar por Cliente</label>
            <input
              id="filtroCliente"
              type="text"
              className="form-input"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="form-group">
            <label htmlFor="filtroServicio" className="form-label">Filtrar por Servicio</label>
            <input
              id="filtroServicio"
              type="text"
              className="form-input"
              value={filtroServicio}
              onChange={(e) => setFiltroServicio(e.target.value)}
              placeholder="Nombre del servicio"
            />
          </div>
         </div>
        <div className="mt-8">
          <h2 className="cita-title text-center">Citas Programadas</h2>
          {citasFiltradas.length > 0 ? (
            <div className="cardCitas">
              {citasFiltradas.map((cita) => (
                <div key={cita.id} className="reparacion-card">
                  <div className="mb-4">
                    <span className="detalle-label">Cliente: </span>
                    <span className="detalle-costo">{cita.cliente}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Servicio: </span>
                    <span className="detalle-costo">{cita.servicio}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Fecha: </span>
                    <span className="detalle-costo">{cita.fecha}</span>
                  </div>
                  <div className="mb-4">
                    <span className="detalle-label">Hora: </span>
                    <span className="detalle-costo">{cita.hora}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="advertencia">No se encontraron citas con los filtros aplicados.</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default ConsultarCitas;
