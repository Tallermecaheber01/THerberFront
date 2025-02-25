import React, { useState } from 'react';
import Breadcrumbs from "../Breadcrumbs";

// Componente principal para asignar citas
function AsignacionCita() {
  // Estado inicial con la lista de clientes y sus respectivos autos (cada auto tiene una marca y modelos)
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

  // Lista de empleados disponibles
  const empleados = [
    { id: 1, nombre: 'Pedro' },
    { id: 2, nombre: 'Pablo' },
    { id: 3, nombre: 'Matias' },
  ];

  // Lista de servicios disponibles (solo se maneja el nombre, sin costo inicial)
  const serviciosDisponibles = [
    { nombre: 'Cambio de aceite' },
    { nombre: 'Cambio de llantas' },
    { nombre: 'Revisión general' },
  ];

  // Rutas para el componente Breadcrumbs (muestra la ruta de navegación)
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Asignar cita", link: "/asignacioncita" },
  ];

  // Estados para la búsqueda y selección de cliente
  const [busquedaCliente, setBusquedaCliente] = useState(''); // Texto ingresado para buscar cliente
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Cliente que se selecciona

  // Estados para la selección de auto (marca y modelo) del cliente seleccionado
  const [selectedMarca, setSelectedMarca] = useState(''); // Marca seleccionada
  const [selectedModelo, setSelectedModelo] = useState(''); // Modelo seleccionado

  // Estados para la búsqueda y asignación de servicios
  const [busquedaServicio, setBusquedaServicio] = useState(''); // Texto para buscar servicio
  const [servicioCosto, setServicioCosto] = useState(''); // Costo ingresado para el servicio
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]); // Lista de servicios agregados a la cita

  // Otros estados para el formulario de la cita
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(''); // Empleado asignado a la cita
  const [fecha, setFecha] = useState(''); // Fecha de la cita
  const [hora, setHora] = useState(''); // Hora de la cita
  const [extraAmount, setExtraAmount] = useState(''); // Cantidad extra que se puede sumar o restar al costo total
  const [totalCosto, setTotalCosto] = useState(0); // Costo total acumulado de los servicios

  // Filtrar clientes según el término de búsqueda (por nombre o ID)
  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      cliente.id.toString().includes(busquedaCliente)
  );

  // Filtrar servicios disponibles según el término ingresado
  const serviciosFiltrados = serviciosDisponibles.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  // Función para seleccionar un cliente de la lista filtrada
  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente); // Guarda el cliente seleccionado
    setBusquedaCliente(''); // Limpia el input de búsqueda
    // Al cambiar de cliente, reinicia la selección de marca y modelo
    setSelectedMarca('');
    setSelectedModelo('');
  };

  // Función para eliminar el cliente seleccionado y reiniciar campos asociados
  const handleEliminarCliente = (e) => {
    e.preventDefault();
    setClienteSeleccionado(null);
    setSelectedMarca('');
    setSelectedModelo('');
  };

  // Función para agregar un servicio a la lista de servicios seleccionados
  // Incluye validaciones para evitar entradas incorrectas o duplicadas
  const handleAgregarServicio = (e) => {
    e.preventDefault();

    // Validar que se haya ingresado un servicio
    if (!busquedaServicio) {
      alert('Por favor, seleccione un servicio de la lista.');
      return;
    }

    // Verifica que el servicio ingresado exista en la lista de servicios disponibles
    const servicioValido = serviciosDisponibles.find(
      (s) => s.nombre.toLowerCase() === busquedaServicio.toLowerCase()
    );
    if (!servicioValido) {
      alert('El servicio ingresado no existe. Seleccione un servicio válido de la lista.');
      return;
    }

    // Evitar duplicados: verifica si el servicio ya fue agregado
    const servicioDuplicado = serviciosSeleccionados.some(
      (s) => s.nombre.toLowerCase() === busquedaServicio.toLowerCase()
    );
    if (servicioDuplicado) {
      alert('El servicio ya ha sido agregado.');
      return;
    }

    // Convierte el costo ingresado a número y valida su integridad
    const costo = parseFloat(servicioCosto);
    if (isNaN(costo)) {
      alert('Ingrese un costo válido.');
      return;
    }
    if (costo < 0) {
      alert('El costo no puede ser negativo.');
      return;
    }

    // Agrega el servicio con su costo a la lista de servicios seleccionados
    setServiciosSeleccionados((prev) => [
      ...prev,
      { nombre: busquedaServicio, costo },
    ]);
    // Actualiza el costo total sumando el costo del nuevo servicio
    setTotalCosto((prev) => prev + costo);
    // Reinicia los inputs de búsqueda y costo para el servicio
    setBusquedaServicio('');
    setServicioCosto('');
  };

  // Función para quitar un servicio de la lista y actualizar el costo total
  const handleQuitarServicio = (servicio) => {
    // Elimina el servicio de la lista
    setServiciosSeleccionados((prev) =>
      prev.filter((s) => s !== servicio)
    );
    // Resta el costo del servicio removido del total, asegurándose que no sea negativo
    setTotalCosto((prev) => {
      const nuevoTotal = prev - servicio.costo;
      return nuevoTotal < 0 ? 0 : nuevoTotal;
    });
  };

  // Función para sumar un monto extra al costo total
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

  // Función para restar un monto extra del costo total
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

  // Función para asignar la cita, valida que todos los campos necesarios estén completos
  const handleAsignarCita = (e) => {
    e.preventDefault();
    if (
      !clienteSeleccionado ||
      !empleadoSeleccionado ||
      !fecha ||
      !hora ||
      serviciosSeleccionados.length === 0
    ) {
      alert('Por favor, complete todos los campos antes de asignar la cita.');
      return;
    }
    // Simulación de asignación de la cita (aquí se podría integrar con backend)
    alert('Cita asignada con éxito.');
    // Limpia todos los campos del formulario tras asignar la cita
    limpiarCampos();
  };

  // Función para reiniciar todos los campos y estados del formulario
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
  };

  // Función para cancelar la operación y limpiar los campos
  const handleCancelar = (e) => {
    e.preventDefault();
    limpiarCampos();
  };

  return (
    <div>
      {/* Componente de navegación con la ruta actual */}
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="citasContainer">
        <form className="citasForm">
          <div className="flex-1">
            <h1 className="form-title">Asignar Cita</h1>

            {/* Sección para la búsqueda y selección de cliente */}
            <div className="form-group">
              <label htmlFor="busquedaCliente" className="form-label">
                Buscar Cliente por Nombre o ID
              </label>
              {/* Si no hay cliente seleccionado, se muestra el input de búsqueda */}
              {!clienteSeleccionado && (
                <input
                  id="busquedaCliente"
                  className="form-input"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Escriba el nombre o ID del cliente"
                />
              )}
              {/* Muestra los resultados filtrados mientras se escribe en el input */}
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
              {/* Si ya se seleccionó un cliente, se muestra su información y opción para cambiarlo */}
              {clienteSeleccionado && (
                <div>
                  <span className="cita-subtitle">
                    Cliente Seleccionado: {clienteSeleccionado.nombre}
                  </span>
                  <div className="mt-2">
                    <button className="btn-cancelar" onClick={(e) => { e.preventDefault(); handleEliminarCliente(e); }}>
                      Cambiar Cliente
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sección para la selección de marca y modelo del auto (solo si hay cliente seleccionado) */}
            {clienteSeleccionado && clienteSeleccionado.cars && (
              <>
                <div className="form-group">
                  <label htmlFor="marcaSelect" className="form-label">Marca:</label>
                  <select
                    id="marcaSelect"
                    className="form-input"
                    value={selectedMarca}
                    onChange={(e) => { 
                      setSelectedMarca(e.target.value); 
                      // Al cambiar la marca, se reinicia la selección de modelo
                      setSelectedModelo(''); 
                    }}
                  >
                    <option value="">Selecciona una marca</option>
                    {/* Lista de marcas disponibles según el cliente seleccionado */}
                    {clienteSeleccionado.cars.map((car) => (
                      <option key={car.marca} value={car.marca}>
                        {car.marca}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Si se ha seleccionado una marca, se muestra el select para elegir el modelo */}
                {selectedMarca && (
                  <div className="form-group">
                    <label htmlFor="modeloSelect" className="form-label">Modelo:</label>
                    <select
                      id="modeloSelect"
                      className="form-input"
                      value={selectedModelo}
                      onChange={(e) => setSelectedModelo(e.target.value)}
                    >
                      <option value="">Selecciona un modelo</option>
                      {/* Se buscan los modelos correspondientes a la marca seleccionada */}
                      {clienteSeleccionado.cars
                        .find((car) => car.marca === selectedMarca)
                        .modelos.map((modelo, index) => (
                          <option key={index} value={modelo}>
                            {modelo}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Sección para seleccionar empleado, fecha y hora de la cita */}
            <div className="form-group">
              <label htmlFor="empleado" className="form-label">
                Empleado
              </label>
              <select
                id="empleado"
                className="form-input"
                value={empleadoSeleccionado}
                onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                disabled={!clienteSeleccionado}  // Solo habilitado si hay cliente seleccionado
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.nombre}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
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
            </div>

            {/* Sección para la búsqueda y selección de servicios */}
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
              {/* Muestra la lista filtrada de servicios mientras se ingresa texto */}
              {busquedaServicio &&
                serviciosFiltrados.map((servicio, index) => (
                  <div
                    key={index}
                    className="cursorPoint"
                    onClick={() => setBusquedaServicio(servicio.nombre)}
                  >
                    {servicio.nombre}
                  </div>
                ))}
            </div>

            {/* Input para ingresar manualmente el costo del servicio seleccionado */}
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
            {/* Botón para agregar el servicio ingresado a la lista */}
            <div className="form-group">
              <button
                className="btn-aceptar"
                onClick={handleAgregarServicio}
                disabled={!clienteSeleccionado}
              >
                Agregar Servicio
              </button>
            </div>
          </div>

          {/* Sección lateral para mostrar los servicios seleccionados y monto extra */}
          <div className="flex-1">
            <h2 className="cita-title">Servicios seleccionados</h2>
            <div>
              <ul>
                {/* Mapea cada servicio agregado y lo muestra con su costo */}
                {serviciosSeleccionados.map((servicio, index) => (
                  <li key={index} className="resumCita mb-4">
                    <span className="text-lg">
                      {servicio.nombre} - ${servicio.costo}
                    </span>
                    <div className="serviciosSelecc">
                      {/* Botón para eliminar el servicio de la lista */}
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

              {/* Sección para sumar o restar un monto extra al costo total */}
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

              {/* Muestra el costo total acumulado */}
              <p className="cita-subtitle mt-2">Total: ${totalCosto}</p>
            </div>
            <div className="mt-6 flex gap-4">
              {/* Botón para asignar la cita, que valida la integridad del formulario */}
              <button className="btn-aceptar" onClick={handleAsignarCita} disabled={!clienteSeleccionado}>
                Asignar Cita
              </button>
              {/* Botón para cancelar y limpiar el formulario */}
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AsignacionCita;
