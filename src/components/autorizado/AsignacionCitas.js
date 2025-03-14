import React, { useEffect, useState } from 'react';
import { createNewAppointment, getAllUsersClient, getAllEmployees, getAllServices } from '../../api/employ';
import Breadcrumbs from "../Breadcrumbs";

function AsignacionCita() {

  const [usersClient, setUserClient] = useState([]);
  const [service, setService] = useState([]);
  const [employ, setEmploy] = useState([]);

  const fetchData = async () => {
    try {
      // Ejecutar las llamadas a las APIs de forma concurrente
      const [usersResponse, servicesResponse, employeesResponse] = await Promise.all([
        getAllUsersClient(),
        getAllServices(),
        getAllEmployees()
      ]);

      console.log("Usuarios Cliente:", usersResponse);
      console.log("Servicios:", servicesResponse);
      console.log("Empleados:", employeesResponse);

      // Actualizar los estados con los datos obtenidos
      setUserClient(usersResponse);
      setService(servicesResponse);
      setEmploy(employeesResponse);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  // Ejecutar la función fetchData cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []); // El array vacío asegura que solo se ejecute una vez cuando el componente se monta

  // Datos fijos
  const [clientes] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      cars: [
        { marca: 'Toyota', modelos: ['Corolla 2019', 'Camry 2020'] },
        { marca: 'Honda', modelos: ['Civic 2018', 'Accord 2019'] },
      ],
    },
    {
      id: 2,
      nombre: 'María Gómez',
      cars: [
        { marca: 'Ford', modelos: ['Focus 2020', 'Fiesta 2019'] },
        { marca: 'Chevrolet', modelos: ['Malibu 2020'] },
      ],
    },
    {
      id: 3,
      nombre: 'Carlos López',
      cars: [
        { marca: 'Nissan', modelos: ['Sentra 2020', 'Altima 2021'] },
        { marca: 'Mazda', modelos: ['Mazda3 2021'] },
      ],
    },
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
    { name: 'Inicio', link: '/' },
    { name: 'Asignar cita', link: '/asignacioncita' },
  ];

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const clientesFiltrados = usersClient.filter(
    (cliente) =>
      cliente.user_nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.user_id.toString().includes(busquedaCliente)
  );
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [servicioCosto, setServicioCosto] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  // Estados para el formulario de cita
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [totalCosto, setTotalCosto] = useState(0);

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

  const handleAgregarServicio = (e) => {
    e.preventDefault();
    if (!busquedaServicio) {
      return;
    }
    if (!isInputSecure(busquedaServicio)) {
      return;
    }
    const servicioValido = service.find(
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
    setServiciosSeleccionados((prev) => prev.filter((s) => s !== servicio));
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

  const [formErrors, setFormErrors] = useState({});

  const isInputSecure = (value) => {
    return (
      !value.includes("'") &&
      !value.includes('"') &&
      !value.includes(';') &&
      !value.includes('--') &&
      !value.includes('/*') &&
      !value.includes('*/')
    );
  };

  const validateAsignacion = () => {
    const errors = {};

    // Validación de cliente
    if (!clienteSeleccionado) errors.cliente = "Debe seleccionar un cliente.";

    // Validación de autos y selección de marca y modelo
    if (clienteSeleccionado && clienteSeleccionado.vehicles && clienteSeleccionado.vehicles.length > 0) {
      if (!selectedMarca) errors.marca = "Debe seleccionar la marca del auto.";

      if (selectedMarca) {
        // Buscar el auto con la marca seleccionada
        const car = clienteSeleccionado.vehicles.find((vehicle) => vehicle.vehicle_marca === selectedMarca);

        // Validar que se haya seleccionado un modelo, solo si se encontró un vehículo con la marca seleccionada
        if (car && !selectedModelo) errors.modelo = "Debe seleccionar un modelo.";

        // Si se encontró el vehículo con la marca seleccionada, valida el modelo
        if (car && selectedModelo) {
          const modelSelected = car.modelos.find((modelo) => modelo.vehicle_modelo === selectedModelo);
          if (!modelSelected) errors.modelo = "El modelo seleccionado no existe para esta marca.";
        }
      }
    }

    // Validación de empleado
    if (!empleadoSeleccionado) errors.empleado = 'Debe seleccionar un empleado.';
    if (empleadoSeleccionado && !isInputSecure(empleadoSeleccionado))
      errors.empleado = 'El empleado seleccionado contiene caracteres no permitidos.';

    // Validación de fecha y hora
    if (!fecha) errors.fecha = 'Debe seleccionar una fecha.';
    if (!hora) errors.hora = 'Debe seleccionar una hora.';

    // Validación de servicios seleccionados
    if (serviciosSeleccionados.length === 0)
      errors.servicios = 'Debe agregar al menos un servicio.';

    return errors;
  };


  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);

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

  serviciosSeleccionados.forEach((servicio, index) => {
    //console.log(`Servicio ${index + 1}:`, servicio);
  });

  const confirmAsignacion = async () => {
    // Busca el vehículo dentro de los vehículos del cliente que coincide con la marca y el modelo seleccionados
    const vehicleSeleccionado = clienteSeleccionado.vehicles.find(
      (vehiculo) =>
        vehiculo.vehicle_marca === selectedMarca && vehiculo.vehicle_modelo === selectedModelo
    );

    const appointmentData = {
      appointment: {
        nombreCliente: clienteSeleccionado.user_nombre,
        nombreEmpleado: empleadoSeleccionado,
        fecha: fecha,
        hora: hora,
        costoExtra: extraAmount,
        total: totalCosto,
        marca: selectedMarca,
        modelo: selectedModelo
      },
      services: serviciosSeleccionados.map(servicio => ({
        servicio: servicio.nombre,
        costo: servicio.costo
      }))
    };


    console.log("Aouto:", vehicleSeleccionado);
    // Imprime en consola los valores de las variables relevantes
    console.log("Cliente seleccionado:", clienteSeleccionado.user_nombre);
    // Marca y modelo del auto seleccionado
    console.log("Marca del auto seleccionada:", selectedMarca);
    console.log("Modelo del auto seleccionado:", selectedModelo);
    console.log("Empleado seleccionado:", empleadoSeleccionado);
    console.log("Fecha:", fecha);
    console.log("Hora:", hora);
    console.log("Servicios seleccionados:", serviciosSeleccionados);
    console.log("Marca del auto seleccionada:", selectedMarca);
    console.log("Modelo del auto seleccionado:", selectedModelo);

    console.log("Extra:", extraAmount);
    console.log("Costo total:", totalCosto);
    try {
      const response = await createNewAppointment(appointmentData);
      if (response) {
        // Si la cita fue creada exitosamente, muestra el mensaje y limpia los campos
        alert("Cita asignada exitosamente.");
        console.log('data:', appointmentData);
        limpiarCampos();
        setShowConfirmAssignModal(false);
      } else {
        // Si hubo un error en la creación de la cita, maneja el error aquí
        alert("Hubo un error al asignar la cita. Intente nuevamente.");
      }
    } catch (error) {
      alert("Hubo un error al asignar la cita. Intente nuevamente.");
      console.error("Error al crear la cita:", error);
    }
  };

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
                    key={cliente.user_id}
                    className="cursorPoint"
                    onClick={() => handleSeleccionarCliente(cliente)}
                  >
                    {cliente.user_nombre} (ID: {cliente.user_id})
                  </div>
                ))}
              {formErrors.cliente && !clienteSeleccionado && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.cliente}
                </p>
              )}
              {clienteSeleccionado && (
                <div>
                  <span className="cita-subtitle">
                    Cliente Seleccionado: {clienteSeleccionado.user_nombre}
                  </span>
                  <div className="mt-2">
                    <button
                      className="btn-cancelar"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEliminarCliente(e);
                      }}
                    >
                      Cambiar Cliente
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selección de auto */}
            {clienteSeleccionado && clienteSeleccionado.vehicles && (
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
                      setSelectedMarca(e.target.value); // Actualizamos la marca seleccionada
                      setSelectedModelo(''); // Limpiamos la selección de modelo al cambiar la marca
                    }}
                  >
                    <option value="">Selecciona una marca</option>
                    {clienteSeleccionado.vehicles.map((vehiculoGrupo) => (
                      <option key={vehiculoGrupo.vehicle_marca} value={vehiculoGrupo.vehicle_marca}>
                        {vehiculoGrupo.vehicle_marca}
                      </option>
                    ))}
                  </select>
                  {formErrors.marca && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.marca}
                    </p>
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
                      onChange={(e) => setSelectedModelo(e.target.value)} // Actualizamos el modelo seleccionado
                    >
                      <option value="">Selecciona un modelo</option>
                      {clienteSeleccionado.vehicles
                        .find((vehiculoGrupo) => vehiculoGrupo.vehicle_marca === selectedMarca)
                        ?.modelos.map((modelo, index) => (
                          <option key={index} value={modelo.vehicle_modelo}>
                            {modelo.vehicle_modelo}
                          </option>
                        ))}
                    </select>
                    {formErrors.modelo && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.modelo}
                      </p>
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
                {employ.map((empleado) => (
                  <option key={empleado.id} value={empleado.nombre}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
              {formErrors.empleado && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.empleado}
                </p>
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
                service
                  .filter((servicio) =>
                    servicio.nombre
                      .toLowerCase()
                      .includes(busquedaServicio.toLowerCase())
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
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.servicios}
                </p>
              )}
            </div>
          </div>
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
                  <button
                    className="btn-aceptar"
                    onClick={handleSumarExtra}
                    disabled={!clienteSeleccionado}
                  >
                    Sumar Extra
                  </button>
                  <button
                    className="btn-cancelar"
                    onClick={handleRestarExtra}
                    disabled={!clienteSeleccionado}
                  >
                    Restar Extra
                  </button>
                </div>
              </div>
              <p className="cita-subtitle mt-2">Total: ${totalCosto}</p>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                className="btn-aceptar"
                onClick={handleAsignarCita}
                disabled={!clienteSeleccionado}
              >
                Asignar Cita
              </button>
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
      {showConfirmAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              Confirmar Asignación
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Está seguro de asignar la cita para{' '}
              <strong>{clienteSeleccionado.nombre}</strong> al empleado{' '}
              <strong>{empleadoSeleccionado}</strong>, para el{' '}
              <strong>{fecha}</strong> a las <strong>{hora}</strong> con el
              total de <strong>${totalCosto}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn-aceptar"
                onClick={() => setShowConfirmAssignModal(false)}
              >
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
