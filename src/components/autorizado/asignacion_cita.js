import React, { useState } from 'react';

function AsignacionCita() {
  const [clientes] = useState([
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María Gómez' },
    { id: 3, nombre: 'Carlos López' },
  ]);

  const serviciosDisponibles = [
    { nombre: 'Cambio de aceite', costo: 300 },
    { nombre: 'Cambio de llantas', costo: 800 },
    { nombre: 'Revisión general', costo: 1000 },
  ];

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente('');
  };

  const handleEliminarCliente = () => {
    setClienteSeleccionado(null);
  };

  const handleSeleccionarServicio = () => {
    const servicio = serviciosDisponibles.find(
      (servicio) => servicio.nombre.toLowerCase() === busquedaServicio.toLowerCase()
    );
    if (servicio && !serviciosSeleccionados.includes(servicio)) {
      setServiciosSeleccionados((prev) => [...prev, servicio]);
      setBusquedaServicio('');
    }
  };

  const handleQuitarServicio = (servicio) => {
    setServiciosSeleccionados((prev) => prev.filter((s) => s !== servicio));
  };

  const totalCosto = serviciosSeleccionados.reduce((total, servicio) => total + servicio.costo, 0);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const serviciosFiltrados = serviciosDisponibles.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  return (
    <div className="citasContainer">
      <form className="citasForm">
        <div className="flex-1">
          <h1 className="form-title">Asignar Cita</h1>

          <div className="form-group">
            <label htmlFor="busquedaCliente" className="form-label">
              Buscar Cliente por Nombre o ID
            </label>
            {!clienteSeleccionado && (
              <input
                id="busquedaCliente"
                className="form-input"
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                placeholder="Escriba el nombre o ID del cliente"
              />
            )}
            {!clienteSeleccionado &&
              busquedaCliente &&
              clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className="cursorPoint"
                  onClick={() => handleSeleccionarCliente(cliente)}
                >
                  {cliente.nombre} (ID: {cliente.id})
                </div>
              ))}
            {clienteSeleccionado && (
              <div>
                <span className="cita-subtitle">Cliente Seleccionado: {clienteSeleccionado.nombre}</span>
                <div className="mt-2">
                  <button className="btn-cancelar" onClick={handleEliminarCliente}>
                    Cambiar Cliente
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fecha" className="form-label">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              className="form-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hora" className="form-label">
              Hora
            </label>
            <input
              id="hora"
              type="time"
              className="form-input"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="busquedaServicio" className="form-label">
              Buscar Servicio
            </label>
            <input
              id="busquedaServicio"
              className="form-input"
              value={busquedaServicio}
              onChange={(e) => setBusquedaServicio(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSeleccionarServicio()}
              placeholder="Escriba el nombre del servicio"
            />
            {busquedaServicio &&
              serviciosFiltrados.map((servicio, index) => (
                <div
                  key={index}
                  className="cursorPoint"
                  onClick={() => {
                    setBusquedaServicio(servicio.nombre);
                    handleSeleccionarServicio();
                  }}
                >
                  {servicio.nombre}
                </div>
              ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="cita-title">Resumen de Cita</h2>
          <div>
            <p className="cita-subtitle">Cliente: {clienteSeleccionado?.nombre || 'No seleccionado'}</p>
            <h3 className="cita-subtitle mt-4">Servicios Seleccionados:</h3>
            <ul>
              {serviciosSeleccionados.map((servicio, index) => (
                <li key={index} className="resumCita">
                  <span className="text-lg">{servicio.nombre} - ${servicio.costo}</span>
                  <div className="serviciosSelecc">
                    <button
                      className="btn-cancelar flex justify-center"
                      onClick={() => handleQuitarServicio(servicio)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="cita-subtitle mt-2">Total: ${totalCosto}</p>
          </div>
          <div className="mt-6 flex gap-4">
            <div>
              <button className="btn-aceptar">Asignar Cita</button>
            </div>
            <div>
              <button className="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AsignacionCita;
