import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function ConsultasReparaciones() {
  // Breadcrumbs fijos para la navegación (ruta de la aplicación).
  // Estos se utilizarán para mostrar la ruta y, en el backend, pueden usarse para saber de dónde proviene la acción.
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Reparaciones Realizadas", link: "/ConsultasReparaciones" }
  ];

  // Datos de ejemplo de reparaciones.
  // Cada objeto "cita" representa una reparación realizada y contiene:
  // - id: Identificador único.
  // - cliente: Nombre del cliente.
  // - servicio: Servicio(s) realizados; en el backend se espera un string (posiblemente separado por saltos de línea).
  // - fecha y hora: Datos temporales de la reparación.
  // - costo: Valor actual del servicio.
  // - marca y modelo: Información del vehículo.
  // - comentario: Comentarios adicionales (para actualización o revisión).
  const [citas, setCitas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      servicio: "Cambio de aceite",
      fecha: "2025-01-05",
      hora: "10:00",
      costo: 50,
      marca: "Toyota",
      modelo: "Corolla 2019",
      comentario: ""
    },
    {
      id: 2,
      cliente: "María Gómez",
      servicio: "Revisión general",
      fecha: "2025-01-06",
      hora: "12:00",
      costo: 75,
      marca: "Honda",
      modelo: "Civic 2018",
      comentario: ""
    },
    {
      id: 3,
      cliente: "Carlos López",
      servicio: "Cambio de llantas",
      fecha: "2025-01-05",
      hora: "14:00",
      costo: 100,
      marca: "Ford",
      modelo: "Focus 2020",
      comentario: ""
    }
  ]);

  // Estados para el proceso de edición de una reparación.
  // 'citaSeleccionada' guarda la reparación que se está editando.
  // 'comentario' permite actualizar o agregar información adicional.
  // 'extra' es el valor que se suma o resta al costo (puede ser usado para ajustar imprevistos).
  // 'serviciosExtra' es el texto ingresado para autocompletar un servicio extra.
  // 'tempCost' es el costo temporal modificado durante la edición.
  // 'tempServices' almacena un arreglo de servicios extra agregados (estos se unirán en un string para enviarlos al backend).
  // 'suggestions' contiene las sugerencias de autocompletado para el servicio extra.
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState("");
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Estados para la búsqueda básica y filtros avanzados.
  // 'filters' es un arreglo de objetos con:
  //    - type: el campo por el que se filtra (ejemplo: cliente, servicio, etc.).
  //    - value: el valor a buscar en dicho campo.
  // 'searchQuery' es el término de búsqueda general que se aplicará a todas las propiedades.
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const availableFilterTypes = ["cliente", "servicio", "marca", "modelo", "costo"];

  // Arreglo de servicios permitidos para autocompletar.
  // El backend debe conocer esta lista para validar que se envían servicios válidos.
  const allowedServices = [
    "Cambio de aceite",
    "Revisión general",
    "Cambio de llantas",
    "Afinación",
    "Cambio de pastillas"
  ];

  // FUNCIONES PARA LA EDICIÓN DE REPARACIÓN

  // Abre el formulario de edición y carga los datos de la reparación seleccionada.
  // Esto permite que el backend reciba la reparación completa con las modificaciones realizadas.
  const handleEditarReparacion = (cita) => {
    setCitaSeleccionada(cita);
    setComentario(cita.comentario || "");
    setExtra(0);
    setTempCost(cita.costo);
    // Si existen servicios, se separan por saltos de línea para trabajar individualmente.
    const serviciosIniciales = cita.servicio ? cita.servicio.split("\n") : [];
    setTempServices(serviciosIniciales);
    setServiciosExtra("");
    setSuggestions([]);
  };

  // Suma el valor 'extra' al costo actual de la reparación.
  const handleSumarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => prevCost + extraVal);
    setExtra(0);
  };

  // Resta el valor 'extra' del costo actual, sin permitir un costo negativo.
  const handleRestarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => {
      const newCost = prevCost - extraVal;
      return newCost < 0 ? 0 : newCost;
    });
    setExtra(0);
  };

  // Actualiza el campo de servicio extra y filtra las sugerencias.
  // Aquí se busca que el input muestre sugerencias con fondo blanco y del mismo tamaño que el input.
  const handleServicioExtraChange = (e) => {
    const inputValue = e.target.value;
    setServiciosExtra(inputValue);
    if (inputValue.trim() !== "") {
      // Se filtran las opciones permitidas (no se diferencia entre mayúsculas y minúsculas)
      const filtered = allowedServices.filter((service) =>
        service.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Al seleccionar una sugerencia, se establece el servicio extra y se limpian las sugerencias.
  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion);
    setSuggestions([]);
  };

  // Agrega el servicio extra ingresado al arreglo temporal.
  // Se valida que el servicio sea exactamente uno de los permitidos y que no se repita.
  // En el backend, este arreglo se unirá (por ejemplo, usando "\n") para formar el campo 'servicio'.
  const handleAgregarServicio = () => {
    const serviceTrimmed = serviciosExtra.trim();
    if (serviceTrimmed === "") return;
    if (!allowedServices.includes(serviceTrimmed)) {
      alert("El servicio ingresado no es válido.");
      return;
    }
    if (tempServices.includes(serviceTrimmed)) {
      alert("El servicio ya ha sido agregado.");
      return;
    }
    setTempServices((prev) => [...prev, serviceTrimmed]);
    setServiciosExtra("");
    setSuggestions([]);
  };

  // Elimina un servicio del arreglo temporal.
  // Esta acción se reflejará en la edición de la reparación y se enviará al backend.
  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  // Guarda la reparación editada.
  // Se arma un objeto 'citaActualizada' con los campos:
  // - comentario, costo actualizado y servicio (los servicios extra se unen en un string separado por "\n").
  // Este objeto se actualizará en la lista de reparaciones y, eventualmente, se enviará al backend.
  const handleGuardarReparacion = () => {
    if (!citaSeleccionada) return;
    const serviciosFinales = tempServices.join("\n");
    const citaActualizada = {
      ...citaSeleccionada,
      comentario,
      costo: tempCost,
      servicio: serviciosFinales
    };
    // Se actualiza el estado de 'citas' reemplazando la reparación editada.
    const nuevasCitas = citas.map((c) =>
      c.id === citaSeleccionada.id ? citaActualizada : c
    );
    setCitas(nuevasCitas);
    cerrarFormulario();
  };

  // Reinicia el formulario de edición, limpiando todos los campos.
  const cerrarFormulario = () => {
    setCitaSeleccionada(null);
    setComentario("");
    setExtra(0);
    setServiciosExtra("");
    setTempCost(0);
    setTempServices([]);
    setSuggestions([]);
  };

  // Función para cancelar la edición (evita comportamiento por defecto del form).
  const handleCancelar = (e) => {
    e.preventDefault();
    cerrarFormulario();
  };

  // UTILIDADES Y FUNCIONES PARA FILTROS Y BÚSQUEDA

  // Normaliza las cadenas (quita acentos y convierte a minúsculas) para comparaciones insensibles.
  const normalizeStr = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Genera los breadcrumbs dinámicos combinando los fijos con los filtros activos.
  // Cada breadcrumb dinámico muestra el tipo de filtro (capitalizado) y su valor.
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type.trim() !== "" && filter.value.trim() !== ""
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name:
        filter.type.charAt(0).toUpperCase() +
        filter.type.slice(1) +
        ": " +
        filter.value,
      link: "#"
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  const dynamicBreadcrumbs = getDynamicBreadcrumbs();

  // Al hacer clic en un breadcrumb, se reinician o eliminan filtros.
  // Si se hace clic en un breadcrumb fijo, se limpian todos los filtros y la búsqueda.
  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  // Actualiza un filtro específico (tipo o valor) en el índice dado.
  // Esto permite que el backend entienda cómo se filtran las reparaciones.
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro si el último filtro está completamente definido (máximo 3 filtros).
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type.trim() !== "" &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  // Elimina un filtro en la posición indicada.
  // Si se eliminan todos los filtros, se deja uno vacío para reiniciar la búsqueda.
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  // Filtrado de reparaciones: se aplica la búsqueda general (searchQuery) y los filtros avanzados.
  // Cada reparación se evalúa para ver si contiene el término de búsqueda en alguno de sus campos,
  // y si cumple con los criterios de cada filtro activo.
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === "" || filter.value.trim() === "") return true;
      const citaField = cita[filter.type.toLowerCase()];
      if (!citaField) return false;
      return normalizeStr(String(citaField)).includes(
        normalizeStr(filter.value)
      );
    });
    return matchesSearch && matchesAdvanced;
  });

  return (
    <div>
      {/* Se renderizan los breadcrumbs dinámicos.
          Estos breadcrumbs ayudan a visualizar los filtros aplicados,
          lo cual es útil para el backend al saber qué criterios se usan en la consulta. */}
      <Breadcrumbs paths={dynamicBreadcrumbs} onCrumbClick={handleBreadcrumbClick} />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Reparaciones Realizadas</h1>
           
          {/* Sección de búsqueda y filtros.
              La búsqueda general se aplica sobre todas las propiedades de la reparación.
              Los filtros avanzados permiten afinar la búsqueda por campos específicos.
              Estos criterios se pueden enviar al backend para consultas más precisas. */}
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {filters.length === 1 &&
              filters[0].type.trim() === "" &&
              filters[0].value.trim() === "" && (
                <input
                  type="text"
                  placeholder="Buscar reparaciones"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-72 text-right"
                />
              )}
            <div className="flex flex-col gap-4 items-end">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={filter.type}
                    onChange={(e) =>
                      handleFilterChange(index, "type", e.target.value)
                    }
                    className="form-input w-64 text-right"
                  >
                    <option value="">Selecciona tipo de filtro</option>
                    {availableFilterTypes
                      .filter((type) => {
                        // Se evita seleccionar el mismo filtro dos veces
                        if (filter.type === type) return true;
                        return !filters.some(
                          (f, i) => i !== index && f.type === type
                        );
                      })
                      .map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>
                  <input
                    type={filter.type.toLowerCase() === "costo" ? "number" : "text"}
                    placeholder="Busqueda"
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                    className="form-input w-64 text-right"
                  />
                  {filters.length > 1 && (
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="textError"
                      type="button"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              {filters.length < 3 &&
                filters[filters.length - 1].type.trim() !== "" &&
                filters[filters.length - 1].value.trim() !== "" && (
                  <button
                    onClick={handleAddFilter}
                    className="button-yellow w-40"
                    type="button"
                  >
                    Agregar Filtro
                  </button>
                )}
            </div>
          </div>
 
          {/* Listado de reparaciones filtradas.
              Aquí se muestran los datos que se enviarán al backend en caso de editar o consultar reparaciones.
              Cada reparación incluye información clave (cliente, servicio, fecha, hora, costo, vehículo). */}
          <div className="mt-8">
            {filteredCitas.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCitas.map((cita) => (
                  <div key={cita.id} className="reparacion-card p-4 rounded-md">
                    <div className="mb-1">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{cita.cliente}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Servicio: </span>
                      <span className="detalle-costo">
                        {cita.servicio
                          ? cita.servicio.split("\n").map((serv, idx) => (
                              <div key={idx}>{serv}</div>
                            ))
                          : "N/A"}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Fecha: </span>
                      <span className="detalle-costo">{cita.fecha}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>
                    {cita.costo !== undefined && (
                      <div className="mb-1">
                        <span className="detalle-label">Costo: </span>
                        <span className="detalle-costo">${cita.costo}</span>
                      </div>
                    )}
                    {cita.marca && (
                      <div className="mb-1">
                        <span className="detalle-label">Marca: </span>
                        <span className="detalle-costo">{cita.marca}</span>
                      </div>
                    )}
                    {cita.modelo && (
                      <div className="mb-1">
                        <span className="detalle-label">Modelo: </span>
                        <span className="detalle-costo">{cita.modelo}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-aceptar w-full mt-2"
                      onClick={() => handleEditarReparacion(cita)}
                    >
                      Editar Reparación
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia">
                No se encontraron reparaciones con los filtros aplicados.
              </p>
            )}
          </div>
 
          {/* Formulario de edición (visible al seleccionar una reparación).
              En este formulario se permite:
              - Actualizar el costo (incluyendo suma/resta de un valor extra).
              - Agregar un comentario.
              - Agregar servicios extra mediante autocompletado.
              - Eliminar servicios extra (cada servicio extra tiene un botón "X" a su lado).
              Los datos modificados se enviarán al backend cuando se guarde la reparación. */}
          {citaSeleccionada && (
            <div className="mt-8">
              <h2 className="cita-title text-center">Editar Reparación</h2>
              <div className="reparacion-card mb-4 p-4 rounded-md">
                <div className="mb-1">
                  <span className="detalle-label">Costo Actual: </span>
                  <span className="detalle-costo">${citaSeleccionada.costo}</span>
                </div>
                <div className="mb-1">
                  <span className="detalle-label">Comentario: </span>
                  <textarea
                    className="form-input w-full"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe un comentario sobre la reparación..."
                  />
                </div>
                <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
                  <div>
                    <span className="detalle-label">Extra: </span>
                    <input
                      type="number"
                      min="0"
                      className="form-input w-32 text-right"
                      value={extra === 0 ? "" : extra}
                      onChange={(e) => setExtra(Number(e.target.value))}
                      placeholder="Extra"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-aceptar mt-5"
                    onClick={handleSumarExtra}
                  >
                    Sumar
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar mt-5"
                    onClick={handleRestarExtra}
                  >
                    Restar
                  </button>
                </div>
                <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
                  <div className="relative">
                    <span className="detalle-label">Servicio Extra: </span>
                    <input
                      type="text"
                      className="form-input w-48 text-right"
                      value={serviciosExtra}
                      onChange={handleServicioExtraChange}
                      placeholder="Ej: Afinación"
                    />
                    {/* Contenedor de sugerencias con fondo blanco y borde gris, del mismo ancho que el input */}
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
                  <button
                    type="button"
                    className="btn-aceptar mt-5"
                    onClick={handleAgregarServicio}
                  >
                    Añadir Servicio
                  </button>
                </div>
                {tempServices.length > 0 && (
                  <div className="mb-1">
                    <span className="detalle-label">Servicios: </span>
                    {/* Lista de servicios extra agregados.
                        Cada servicio se muestra junto a un botón "X" para eliminarlo.
                        La estructura se envía al backend como parte del campo 'servicio' */}
                    <ul className="detalle-costo">
                      {tempServices.map((serv, idx) => (
                        <li
                          key={idx}
                          className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded"
                        >
                          <span>{serv}</span>
                          <button
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
                  <span className="detalle-label">Costo Nuevo: </span>
                  <span className="detalle-costo">${tempCost}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <button
                  type="button"
                  className="btn-aceptar mt-2"
                  onClick={handleGuardarReparacion}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-cancelar mt-2"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ConsultasReparaciones;
