import React, { useState } from 'react';
import Breadcrumbs from "../Breadcrumbs";

function AsignacionCita() {
  // Datos fijos
  const [clientes] = useState([
    { 
      id: 1, 
      nombre: 'Juan Pérez',
      cars: [
        { marca: 'Toyota', modelos: ['Corolla 2019', 'Camry 2020'] },
        { marca: 'Honda', modelos: ['Civic 2018', 'Accord 2019'] }
      ]
    },
    { 
      id: 2, 
      nombre: 'María Gómez',
      cars: [
        { marca: 'Ford', modelos: ['Focus 2020', 'Fiesta 2019'] },
        { marca: 'Chevrolet', modelos: ['Malibu 2020'] }
      ]
    },
    { 
      id: 3, 
      nombre: 'Carlos López',
      cars: [
        { marca: 'Nissan', modelos: ['Sentra 2020', 'Altima 2021'] },
        { marca: 'Mazda', modelos: ['Mazda3 2021'] }
      ]
    }
  ]);

  const empleados = [
    { id: 1, nombre: 'Pedro' },
    { id: 2, nombre: 'Pablo' },
    { id: 3, nombre: 'Matias' },
  ];

  const serviciosDisponibles = [
    { nombre: 'Cambio de aceite' },
    { nombre: 'Cambio de llantas' },
    { nombre: 'Revisión general' },
  ];

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Asignar cita", link: "/asignacioncita" },
  ];

  // Estados de búsqueda y selección
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.id.toString().includes(busquedaCliente)
  );
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Selección de auto
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');

  // Estados para servicios
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [servicioCosto, setServicioCosto] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  
  // Estados para el formulario de cita
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [totalCosto, setTotalCosto] = useState(0);


  // Función para seleccionar cliente
  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente('');
    setSelectedMarca('');
    setSelectedModelo('');
  };

  const handleEliminarCliente = (e) => {
    e.preventDefault();
    setClienteSeleccionado(null);
    setSelectedMarca('');
    setSelectedModelo('');
  };

  // Función para agregar servicio
  const handleAgregarServicio = (e) => {
    e.preventDefault();
    if (!busquedaServicio) {
      return;
    }
    // Validación contra inyección SQL para el input de servicio
    if (!isInputSecure(busquedaServicio)) {
      return;
    }
    const servicioValido = serviciosDisponibles.find(
      (s) => s.nombre.toLowerCase() === busquedaServicio.toLowerCase()
    );
    if (!servicioValido) {
      return;
    }
    const servicioDuplicado = serviciosSeleccionados.some(
      (s) => s.nombre.toLowerCase() === busquedaServicio.toLowerCase()
    );
    if (servicioDuplicado) {
      return;
    }
    const costo = parseFloat(servicioCosto);
    if (isNaN(costo)) {
      return;
    }
    if (costo < 0) {
      return;
    }
    setServiciosSeleccionados((prev) => [
      ...prev,
      { nombre: busquedaServicio, costo },
    ]);
    setTotalCosto((prev) => prev + costo);
    setBusquedaServicio('');
    setServicioCosto('');
  };

  const handleQuitarServicio = (servicio) => {
    setServiciosSeleccionados((prev) =>
      prev.filter((s) => s !== servicio)
    );
    setTotalCosto((prev) => {
      const nuevoTotal = prev - servicio.costo;
      return nuevoTotal < 0 ? 0 : nuevoTotal;
    });
  };

  const handleSumarExtra = (e) => {
    e.preventDefault();
    const extra = parseFloat(extraAmount);
    if (isNaN(extra)) {
      alert('Ingrese una cantidad extra válida.');
      return;
    }
    if (extra < 0) {
      alert('La cantidad extra no puede ser negativa.');
      return;
    }
    setTotalCosto((prev) => prev + extra);
  };

  const handleRestarExtra = (e) => {
    e.preventDefault();
    const extra = parseFloat(extraAmount);
    if (isNaN(extra)) {
      alert('Ingrese una cantidad extra válida.');
      return;
    }
    if (extra < 0) {
      alert('La cantidad extra no puede ser negativa.');
      return;
    }
    setTotalCosto((prev) => (prev - extra < 0 ? 0 : prev - extra));
  };

  // Función para limpiar el formulario
  const limpiarCampos = () => {
    setClienteSeleccionado(null);
    setBusquedaCliente('');
    setSelectedMarca('');
    setSelectedModelo('');
    setEmpleadoSeleccionado('');
    setFecha('');
    setHora('');
    setBusquedaServicio('');
    setServicioCosto('');
    setServiciosSeleccionados([]);
    setExtraAmount('');
    setTotalCosto(0);
    setFormErrors({});
  };

  // Estado para errores en el formulario de asignación
  const [formErrors, setFormErrors] = useState({});

  // Función para prevenir caracteres potencialmente peligrosos (simula validación contra inyecciones SQL)
  const isInputSecure = (value) => {
    return (
      !value.includes("'") &&
      !value.includes('"') &&
      !value.includes(";") &&
      !value.includes("--") &&
      !value.includes("/*") &&
      !value.includes("*/")
    );
  };

  // Función de validación: revisa que se hayan completado todos los campos requeridos
  const validateAsignacion = () => {
    const errors = {};
    if (!clienteSeleccionado) errors.cliente = "Debe seleccionar un cliente.";
    if (clienteSeleccionado && clienteSeleccionado.cars && clienteSeleccionado.cars.length > 0) {
      if (!selectedMarca) errors.marca = "Debe seleccionar la marca del auto.";
      if (selectedMarca) {
        const car = clienteSeleccionado.cars.find((car) => car.marca === selectedMarca);
        if (car && !selectedModelo) errors.modelo = "Debe seleccionar un modelo.";
      }
    }
    if (!empleadoSeleccionado) errors.empleado = "Debe seleccionar un empleado.";
    if (empleadoSeleccionado && !isInputSecure(empleadoSeleccionado))
      errors.empleado = "El empleado seleccionado contiene caracteres no permitidos.";
    if (!fecha) errors.fecha = "Debe seleccionar una fecha.";
    if (!hora) errors.hora = "Debe seleccionar una hora.";
    if (serviciosSeleccionados.length === 0) errors.servicios = "Debe agregar al menos un servicio.";
    return errors;
  };

  // Estado para mostrar el modal de confirmación de asignación
  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);

  // Función para intentar asignar la cita (valida y muestra modal de confirmación)
  const handleAsignarCita = (e) => {
    e.preventDefault();
    const errors = validateAsignacion();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setShowConfirmAssignModal(true);
  };

  
  const confirmAsignacion = () => {
    limpiarCampos();
    setShowConfirmAssignModal(false);
  };

  // Función para cancelar la operación
  const handleCancelar = (e) => {
    e.preventDefault();
    limpiarCampos();
  };

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="citasContainer">
        <form className="citasForm">
          <div className="flex-1">
            <h1 className="form-title">Asignar Cita</h1>

            {/* Búsqueda y selección de cliente */}
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
              {formErrors.cliente && !clienteSeleccionado && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cliente}</p>
              )}
              {clienteSeleccionado && (
                <div>
                  <span className="cita-subtitle">
                    Cliente Seleccionado: {clienteSeleccionado.nombre}
                  </span>
                  <div className="mt-2">
                    <button
                      className="btn-cancelar"
                      onClick={(e) => { e.preventDefault(); handleEliminarCliente(e); }}
                    >
                      Cambiar Cliente
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selección de auto */}
            {clienteSeleccionado && clienteSeleccionado.cars && (
              <>
                <div className="form-group">
                  <label htmlFor="marcaSelect" className="form-label">
                    Marca:
                  </label>
                  <select
                    id="marcaSelect"
                    className="form-input"
                    value={selectedMarca}
                    onChange={(e) => { 
                      setSelectedMarca(e.target.value); 
                      setSelectedModelo(''); 
                    }}
                  >
                    <option value="">Selecciona una marca</option>
                    {clienteSeleccionado.cars.map((car) => (
                      <option key={car.marca} value={car.marca}>
                        {car.marca}
                      </option>
                    ))}
                  </select>
                  {formErrors.marca && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.marca}</p>
                  )}
                </div>
                {selectedMarca && (
                  <div className="form-group">
                    <label htmlFor="modeloSelect" className="form-label">
                      Modelo:
                    </label>
                    <select
                      id="modeloSelect"
                      className="form-input"
                      value={selectedModelo}
                      onChange={(e) => setSelectedModelo(e.target.value)}
                    >
                      <option value="">Selecciona un modelo</option>
                      {clienteSeleccionado.cars
                        .find((car) => car.marca === selectedMarca)
                        .modelos.map((modelo, index) => (
                          <option key={index} value={modelo}>
                            {modelo}
                          </option>
                        ))}
                    </select>
                    {formErrors.modelo && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.modelo}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Selección de empleado, fecha y hora */}
            <div className="form-group">
              <label htmlFor="empleado" className="form-label">
                Empleado
              </label>
              <select
                id="empleado"
                className="form-input"
                value={empleadoSeleccionado}
                onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                disabled={!clienteSeleccionado}
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.nombre}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
              {formErrors.empleado && (
                <p className="text-red-500 text-xs mt-1">{formErrors.empleado}</p>
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
                disabled={!clienteSeleccionado}
              />
              {formErrors.fecha && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fecha}</p>
              )}
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
                disabled={!clienteSeleccionado}
              />
              {formErrors.hora && (
                <p className="text-red-500 text-xs mt-1">{formErrors.hora}</p>
              )}
            </div>

            {/* Selección de servicios */}
            <div className="form-group">
              <label htmlFor="busquedaServicio" className="form-label">
                Buscar Servicio
              </label>
              <input
                id="busquedaServicio"
                className="form-input"
                value={busquedaServicio}
                onChange={(e) => setBusquedaServicio(e.target.value)}
                placeholder="Escriba el nombre del servicio"
                disabled={!clienteSeleccionado}
              />
              {busquedaServicio &&
                serviciosDisponibles
                  .filter((servicio) =>
                    servicio.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
                  )
                  .map((servicio, index) => (
                    <div
                      key={index}
                      className="cursorPoint"
                      onClick={() => setBusquedaServicio(servicio.nombre)}
                    >
                      {servicio.nombre}
                    </div>
                  ))}
            </div>
            <div className="form-group">
              <label htmlFor="servicioCosto" className="form-label">
                Costo del Servicio
              </label>
              <input
                id="servicioCosto"
                type="number"
                className="form-input"
                value={servicioCosto}
                onChange={(e) => setServicioCosto(e.target.value)}
                placeholder="Ingrese el costo"
                disabled={!clienteSeleccionado}
              />
            </div>
            <div className="form-group">
              <button
                className="btn-aceptar"
                onClick={handleAgregarServicio}
                disabled={!clienteSeleccionado}
              >
                Agregar Servicio
              </button>
              {formErrors.servicios && (
                <p className="text-red-500 text-xs mt-1">{formErrors.servicios}</p>
              )}
            </div>
          </div>

          {/* Sección lateral: servicios agregados, extra y total */}
          <div className="flex-1">
            <h2 className="cita-title">Servicios seleccionados</h2>
            <div>
              <ul>
                {serviciosSeleccionados.map((servicio, index) => (
                  <li key={index} className="resumCita mb-4">
                    <span className="text-lg">
                      {servicio.nombre} - ${servicio.costo}
                    </span>
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

              <div className="mt-8">
                <div className="form-group">
                  <label htmlFor="extraAmount" className="form-label">
                    Cantidad Extra
                  </label>
                  <input
                    id="extraAmount"
                    type="number"
                    className="form-input"
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value)}
                    placeholder="Ingrese cantidad extra"
                    disabled={!clienteSeleccionado}
                  />
                </div>
                <div className="form-group mt-2 flex gap-2">
                  <button className="btn-aceptar" onClick={handleSumarExtra} disabled={!clienteSeleccionado}>
                    Sumar Extra
                  </button>
                  <button className="btn-cancelar" onClick={handleRestarExtra} disabled={!clienteSeleccionado}>
                    Restar Extra
                  </button>
                </div>
              </div>
              <p className="cita-subtitle mt-2">Total: ${totalCosto}</p>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="btn-aceptar" onClick={handleAsignarCita} disabled={!clienteSeleccionado}>
                Asignar Cita
              </button>
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de confirmación de asignación */}
      {showConfirmAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">Confirmar Asignación</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Está seguro de asignar la cita para <strong>{clienteSeleccionado.nombre}</strong> al empleado <strong>{empleadoSeleccionado}</strong>, para el <strong>{fecha}</strong> a las <strong>{hora}</strong> con el total de <strong>${totalCosto}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button className="btn-aceptar" onClick={() => setShowConfirmAssignModal(false)}>
                Cancelar
              </button>
              <button className="btn-cancelar" onClick={confirmAsignacion}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AsignacionCita;
