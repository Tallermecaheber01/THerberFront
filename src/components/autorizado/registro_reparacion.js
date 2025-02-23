import React, { useState, useEffect } from "react";
import Breadcrumbs from "../Breadcrumbs";

// Este componente maneja el registro de una reparación. Puede operar en dos modos:
// 1. Modo "Reparación Normal": cuando existe una cita previa (almacenada en localStorage)
//    y se cargan datos automáticos de la cita.
// 2. Modo "Reparación Extra": cuando no hay una cita seleccionada y se ingresan todos
//    los datos manualmente (incluyendo la selección del cliente, marca y modelo).
//
// Este archivo está pensado para que el equipo de backend entienda qué datos se generan
// y cómo se estructuran antes de ser enviados o almacenados.
  
// Datos simulados de clientes para el modo de Reparación Extra
const clientes = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cars: [{ marca: "Toyota", modelos: ["Corolla 2019", "Camry 2020"] }]
  },
  {
    id: 2,
    nombre: "María Gómez",
    cars: [
      { marca: "Honda", modelos: ["Civic 2018", "Accord 2019"] },
      { marca: "Ford", modelos: ["Focus 2020"] }
    ]
  },
  {
    id: 3,
    nombre: "Carlos López",
    cars: [
      { marca: "Ford", modelos: ["Focus 2020", "Mustang 2021"] },
      { marca: "Chevrolet", modelos: ["Spark 2018"] }
    ]
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    cars: [{ marca: "Hyundai", modelos: ["Elantra 2019"] }]
  },
  {
    id: 5,
    nombre: "Luis Rodríguez",
    cars: [
      { marca: "Nissan", modelos: ["Sentra 2020", "Altima 2021"] },
      { marca: "Toyota", modelos: ["RAV4 2022"] }
    ]
  },
  {
    id: 6,
    nombre: "Sofía García",
    cars: [
      { marca: "Kia", modelos: ["Rio 2018"] },
      { marca: "Hyundai", modelos: ["Accent 2019", "Elantra 2020"] }
    ]
  },
  {
    id: 7,
    nombre: "Miguel Torres",
    cars: [{ marca: "Chevrolet", modelos: ["Cruze 2019"] }]
  }
];

function RegistroReparacion() {
  // Lista de servicios permitidos para reparación extra.
  // El backend debe conocer que estos son los servicios válidos.
  const allowedServices = [
    "Cambio de aceite",
    "Revisión general",
    "Cambio de llantas",
    "Afinación",
    "Cambio de pastillas"
  ];

  // Estados compartidos:
  // - 'cita': almacena la cita existente (si se seleccionó una) en modo normal.
  // - 'comentario': comentarios adicionales sobre la reparación.
  // - 'extra': valor adicional para sumar/restar al costo.
  // - 'serviciosExtra': campo de entrada para autocompletar servicios extra.
  // - 'tempCost': costo acumulado de la reparación.
  // - 'tempServices': arreglo temporal con los servicios agregados.
  // - 'suggestions': sugerencias para autocompletar el servicio extra.
  // - 'empleado': nombre del empleado asignado.
  // - 'atencionDateTime': fecha y hora de atención (formateada para mostrar).
  const [cita, setCita] = useState(null);
  const [comentario, setComentario] = useState("");
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState("");
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [empleado, setEmpleado] = useState("Pedro Pérez");
  const [atencionDateTime, setAtencionDateTime] = useState("");

  // Estados exclusivos para el modo Reparación Extra (sin cita):
  // - 'clientSearch': texto para buscar clientes.
  // - 'filteredClients': lista de clientes filtrados según la búsqueda.
  // - 'selectedClient': cliente seleccionado manualmente.
  // - 'selectedMarca' y 'selectedModelo': marca y modelo del vehículo seleccionado.
  const [clientSearch, setClientSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");

  // Helper para formatear números (por ejemplo, agregar cero a la izquierda) en fechas y horas.
  const pad = (num) => String(num).padStart(2, "0");

  // Rutas fijas para la navegación (breadcrumbs).
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Consulta citas", link: "/consultacitas" },
    { name: "Registro reparacion", link: "/registroreparaciones" },
  ];

  // useEffect se ejecuta al montar el componente.
  // Se intenta recuperar una cita almacenada en localStorage.
  // Si existe, se activa el modo normal de reparación (cita existente) y se inicializan los campos con datos de la cita.
  // Si no existe, se activa el modo extra, donde el usuario debe ingresar manualmente los datos.
  useEffect(() => {
    const storedCita = localStorage.getItem("selectedCita");
    if (storedCita) {
      const citaObj = JSON.parse(storedCita);
      setCita(citaObj);
      setComentario(citaObj.comentario || "");
      setTempCost(parseFloat(citaObj.costo));
      // Se separan los servicios ya asignados en la cita (si existen) en un arreglo.
      const serviciosIniciales = citaObj.servicio ? citaObj.servicio.split("\n") : [];
      setTempServices(serviciosIniciales);
      const ahora = new Date();
      // Formato para mostrar la fecha y hora (por ejemplo: "05/01/2025 09:05")
      const formattedDateTime = `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()} ${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
      setAtencionDateTime(formattedDateTime);
      setEmpleado("Pedro Pérez");
    } else {
      // Modo Reparación Extra: sin cita previa.
      const ahora = new Date();
      // Se utiliza el formato ISO (datetime-local) para que el input lo acepte.
      const formattedDateTime = `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}T${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
      setAtencionDateTime(formattedDateTime);
      setTempCost(0);
    }
  }, []);

  // Funciones para actualizar el costo de reparación.
  // 'handleSumarExtra' suma un valor extra al costo actual.
  const handleSumarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    const newCost = parseFloat(tempCost) + extraVal;
    setTempCost(newCost);
    setExtra(0);
  };

  // 'handleRestarExtra' resta un valor extra del costo actual, sin permitir que el total sea negativo.
  const handleRestarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    let newCost = parseFloat(tempCost) - extraVal;
    if (newCost < 0) newCost = 0;
    setTempCost(newCost);
    setExtra(0);
  };

  // Funciones para el autocompletado del servicio extra.
  // 'handleServicioExtraChange' actualiza el campo y filtra las sugerencias basándose en la entrada del usuario.
  const handleServicioExtraChange = (e) => {
    const inputValue = e.target.value;
    setServiciosExtra(inputValue);
    if (inputValue.trim() !== "") {
      const filtered = allowedServices.filter((service) =>
        service.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  
  // 'handleSelectSuggestion' establece la sugerencia seleccionada como el servicio extra.
  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion);
    setSuggestions([]);
  };

  // 'handleAgregarServicio' agrega el servicio extra al arreglo de servicios temporales.
  // Valida que el servicio sea válido y no se haya agregado ya.
  const handleAgregarServicio = () => {
    const servicio = serviciosExtra.trim();
    if (servicio !== "" && allowedServices.includes(servicio)) {
      if (
        tempServices.includes(servicio) ||
        (cita && cita.servicio && cita.servicio.split("\n").includes(servicio))
      ) {
        alert("El servicio ya ha sido agregado.");
        return;
      }
      setTempServices((prev) => [...prev, servicio]);
      setServiciosExtra("");
      setSuggestions([]);
    } else {
      alert("El servicio ingresado no es válido.");
    }
  };

  // 'handleGuardarReparacion' simula la acción de guardar la reparación.
  // Se arma un objeto 'reparacion' con todos los datos relevantes, que luego se imprime en consola.
  // Para el modo normal se utilizan datos de la cita, y para el modo extra se requiere que el usuario seleccione cliente, marca y modelo.
  const handleGuardarReparacion = () => {
    let reparacion;
    if (cita) {
      // Modo Normal: se toma la cita existente y se actualiza con los nuevos datos.
      const serviciosFinales = tempServices.join("\n");
      reparacion = {
        ...cita,
        comentario,
        costo: tempCost,
        servicio: serviciosFinales,
        empleado,
        atencionDateTime
      };
    } else {
      // Modo Extra: se requiere que el usuario ingrese manualmente cliente, marca y modelo.
      if (!selectedClient) {
        alert("Debes seleccionar un cliente.");
        return;
      }
      if (!selectedMarca) {
        alert("Debes seleccionar la marca del vehículo.");
        return;
      }
      if (!selectedModelo) {
        alert("Debes seleccionar el modelo del vehículo.");
        return;
      }
      const serviciosFinales = tempServices.join("\n");
      reparacion = {
        cliente: selectedClient.nombre,
        marca: selectedMarca,
        modelo: selectedModelo,
        comentario,
        costo: tempCost,
        servicio: serviciosFinales,
        empleado,
        atencionDateTime
      };
    }
    // Los datos de la reparación se envían al backend (aquí se simula con un console.log).
    console.log("Datos de la reparación guardados:", reparacion);
    // Se elimina la cita almacenada en localStorage (si existe).
    localStorage.removeItem("selectedCita");
    alert("Reparación guardada.");
    cerrarFormulario();
  };

  // 'handleCancelar' cierra el formulario sin guardar los cambios.
  const handleCancelar = () => {
    cerrarFormulario();
  };

  // 'cerrarFormulario' reinicia todos los estados a sus valores iniciales.
  const cerrarFormulario = () => {
    setCita(null);
    setComentario("");
    setExtra(0);
    setServiciosExtra("");
    setTempCost(0);
    setTempServices([]);
    setSuggestions([]);
    setAtencionDateTime("");
    setClientSearch("");
    setFilteredClients([]);
    setSelectedClient(null);
    setSelectedMarca("");
    setSelectedModelo("");
  };

  // --- Renderización del componente ---
  // Si existe una cita, se renderiza el modo "Reparación Normal".
  if (cita) {
    return (
      <div>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="citasContainer">
          <form className="citasForm flex flex-col">
            <h1 className="form-title text-center">Registro de Reparación</h1>
            <div className="reparacion-card mb-4">
              {/* Campos automáticos (datos de la cita y del empleado) */}
              <div className="mb-2">
                <span className="detalle-label">Empleado: </span>
                <span className="detalle-costo">{empleado}</span>
              </div>
              <div className="mb-4">
                <span className="detalle-label">Fecha y Hora de Atención: </span>
                <span className="detalle-costo">{atencionDateTime}</span>
              </div>
              {/* Datos de la cita: cliente, servicio original, fecha y hora de la cita, y costo actual */}
              <div className="mb-2">
                <span className="detalle-label">Cliente: </span>
                <span className="detalle-costo">{cita.cliente}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Servicio: </span>
                <span className="detalle-costo">{cita.servicio}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Fecha cita: </span>
                <span className="detalle-costo">{cita.fecha}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Hora cita: </span>
                <span className="detalle-costo">{cita.hora}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Costo Actual: </span>
                <span className="detalle-costo">{`$${cita.costo}`}</span>
              </div>
              {/* Formulario de edición de la reparación */}
              <div className="mb-2">
                <span className="detalle-label">Comentario: </span>
                <textarea
                  className="form-input w-full"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escribe un comentario sobre la reparación..."
                />
              </div>
              {/* Sección para sumar o restar valores extra al costo */}
              <div className="mb-2 flex flex-col sm:flex-row gap-2 items-center">
                <div>
                  <span className="detalle-label">Extra: </span>
                  <input
                    type="number"
                    min="0"
                    className="form-input w-32 text-right"
                    value={extra}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setExtra(val < 0 ? 0 : val);
                    }}
                    placeholder="Extra"
                  />
                </div>
                <button type="button" className="btn-aceptar mt-5" onClick={handleSumarExtra}>
                  Sumar
                </button>
                <button type="button" className="btn-cancelar mt-5" onClick={handleRestarExtra}>
                  Restar
                </button>
              </div>
              {/* Sección para agregar un servicio extra mediante autocompletado */}
              <div className="mb-2 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative">
                  <span className="detalle-label">Servicio Extra: </span>
                  <input
                    type="text"
                    className="form-input w-48 text-right"
                    value={serviciosExtra}
                    onChange={handleServicioExtraChange}
                    placeholder="Ej: Afinación"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 w-48 text-black">
                      {suggestions.map((sug, idx) => (
                        <div
                          key={idx}
                          className="p-1 cursor-pointer text-sm"
                          onClick={() => handleSelectSuggestion(sug)}
                        >
                          {sug}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="btn-aceptar mt-5" onClick={handleAgregarServicio}>
                  Añadir Servicio
                </button>
              </div>
              {/* Muestra la lista de servicios extra agregados con botón para quitarlos */}
              {tempServices.length > 0 && (
                <div className="mb-2">
                  <span className="detalle-label">Servicios: </span>
                  <ul className="detalle-costo text-sm">
                    {tempServices.map((serv, idx) => (
                      <li key={idx} className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded">
                        <span>{serv}</span>
                        <button
                          type="button"
                          className="btn-cancelar text-xs flex justify-center items-center"
                          onClick={() => handleQuitarServicio(serv)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Muestra el costo final acumulado */}
              <div className="mb-2">
                <span className="detalle-label">Total Final: </span>
                <span className="detalle-costo">{`$${tempCost}`}</span>
              </div>
            </div>
            {/* Botones para guardar o cancelar el registro */}
            <div className="flex gap-4 justify-center">
              <button type="button" className="btn-aceptar" onClick={handleGuardarReparacion}>
                Guardar
              </button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    // Modo Reparación Extra: no existe una cita previa, por lo que el usuario debe ingresar todos los datos.
    return (
      <div>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="form-container w-[680px] mx-auto">
          <form className="citasForm flex flex-col">
            <h1 className="form-title text-center mb-1">Registro de Reparación Extra</h1>

            {/* Campo para ingresar Fecha y Hora de Atención */}
            <div className="">
              <label className="detalle-label" htmlFor="atencionDateTime">
                Fecha y Hora de Atención:
              </label>
              <input
                id="atencionDateTime"
                type="datetime-local"
                className="form-input w-full text-sm"
                value={atencionDateTime}
                onChange={(e) => setAtencionDateTime(e.target.value)}
              />
            </div>

            {/* Buscador de Cliente: filtra y muestra sugerencias */}
            <div className="relative">
              <label className="detalle-label" htmlFor="clientSearch">
                Buscar Cliente:
              </label>
              <input
                id="clientSearch"
                type="text"
                className="form-input w-full text-sm"
                value={clientSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setClientSearch(value);
                  if (value.trim() !== "") {
                    const filtered = clientes.filter((client) =>
                      client.nombre.toLowerCase().includes(value.toLowerCase())
                    );
                    setFilteredClients(filtered);
                  } else {
                    setFilteredClients([]);
                  }
                }}
                placeholder="Nombre..."
              />
              {filteredClients.length > 0 && (
                <div className="absolute bg-white border border-gray-300 text-black w-full z-10">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="cursor-pointer text-sm p-1"
                      onClick={() => {
                        setSelectedClient(client);
                        setClientSearch(client.nombre);
                        setFilteredClients([]);
                        setSelectedMarca("");
                        setSelectedModelo("");
                      }}
                    >
                      {client.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Si se ha seleccionado un cliente, se muestran los selects para elegir marca y modelo */}
            {selectedClient && (
              <>
                <div className="mb-1">
                  <label className="detalle-label" htmlFor="marcaSelect">
                    Marca:
                  </label>
                  <select
                    id="marcaSelect"
                    className="form-input w-full text-sm"
                    value={selectedMarca}
                    onChange={(e) => {
                      setSelectedMarca(e.target.value);
                      setSelectedModelo("");
                    }}
                  >
                    <option value="">Selecciona una marca</option>
                    {selectedClient.cars.map((car) => (
                      <option key={car.marca} value={car.marca}>
                        {car.marca}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMarca && (
                  <div className="mb-1">
                    <label className="detalle-label" htmlFor="modeloSelect">
                      Modelo:
                    </label>
                    <select
                      id="modeloSelect"
                      className="form-input w-full text-sm"
                      value={selectedModelo}
                      onChange={(e) => setSelectedModelo(e.target.value)}
                    >
                      <option value="">Selecciona un modelo</option>
                      {selectedClient.cars
                        .find((car) => car.marca === selectedMarca)
                        .modelos.map((modelo) => (
                          <option key={modelo} value={modelo}>
                            {modelo}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Formulario de reparación extra */}
            <div className="mb-1">
              <span className="detalle-label">Comentario: </span>
              <textarea
                className="form-input w-full text-sm"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Comentario..."
              />
            </div>

            <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
              <div>
                <span className="detalle-label">Extra: </span>
                <input
                  type="number"
                  min="0"
                  className="form-input w-full text-sm"
                  value={extra}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setExtra(val < 0 ? 0 : val);
                  }}
                  placeholder="Extra"
                />
              </div>
              <button type="button" className="btn-aceptar mt-5" onClick={handleSumarExtra}>
                Sumar
              </button>
              <button type="button" className="btn-cancelar mt-5" onClick={handleRestarExtra}>
                Restar
              </button>
            </div>

            <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
              <div className="relative">
                <span className="detalle-label">Servicio Extra: </span>
                <input
                  type="text"
                  className="form-input w-full text-sm"
                  value={serviciosExtra}
                  onChange={handleServicioExtraChange}
                  placeholder="Ej: Afinación"
                />
                {suggestions.length > 0 && (
                  <div className="absolute bg-white border border-gray-300 text-black w-full z-10">
                    {suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-1 cursor-pointer text-sm"
                        onClick={() => handleSelectSuggestion(sug)}
                      >
                        {sug}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className="btn-aceptar mt-5" onClick={handleAgregarServicio}>
                Añadir Servicio
              </button>
            </div>

            {tempServices.length > 0 && (
              <div className="mb-1">
                <span className="detalle-label">Servicios: </span>
                <ul className="detalle-costo text-sm">
                  {tempServices.map((serv, idx) => (
                    <li key={idx} className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded">
                      <span>{serv}</span>
                      <button
                        type="button"
                        className="btn-cancelar text-xs flex justify-center items-center"
                        onClick={() => handleQuitarServicio(serv)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-1">
              <span className="detalle-label">Total Final: </span>
              <span className="detalle-costo">{`$${tempCost}`}</span>
            </div>

            <div className="flex gap-2 justify-center">
              <button type="button" className="btn-aceptar" onClick={handleGuardarReparacion}>
                Guardar
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
}

export default RegistroReparacion;
