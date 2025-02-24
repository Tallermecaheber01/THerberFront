import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function CrudReparacionesAdmin() {
  // Breadcrumbs estáticos para la navegación de la vista administrativa
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Administrar Reparaciones", link: "/AdminReparaciones" }
  ];

  // Estado inicial de las reparaciones (citas)
  // Estos datos simulados serán reemplazados por la respuesta de una API en el backend
  const [citas, setCitas] = useState([
    {
      id: 1,
      cliente: "Pablo Pérez",
      servicio: "Cambio de aceite",
      fecha: "2025-01-05",
      hora: "10:00",
      costo: 50,
      marca: "Toyota",
      modelo: "Corolla 2019",
      comentario: "",
      empleado: "Ana Torres", // Indica el empleado que realizó la reparación
      fechaGuardado: "2025-01-04" // Fecha en que se guardó la reparación
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
      comentario: "",
      empleado: "Carlos Ruiz",
      fechaGuardado: "2025-01-05"
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
      comentario: "",
      empleado: "Laura Martínez",
      fechaGuardado: "2025-01-04"
    }
  ]);

  // Estados para la edición de una reparación seleccionada
  // Estos estados controlan el formulario de edición, que luego se enviaría al backend
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState("");
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Estado para filtros de búsqueda. Se ha agregado el filtro "empleado"
  const availableFilterTypes = ["cliente", "servicio", "marca", "modelo", "costo", "empleado"];
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados para el modal de eliminación
  // En una implementación real, al confirmar la eliminación se debería hacer una llamada al backend
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Lista de servicios permitidos para autocompletar.
  // El backend debe validar que el servicio recibido esté en esta lista
  const allowedServices = [
    "Cambio de aceite",
    "Revisión general",
    "Cambio de llantas",
    "Afinación",
    "Cambio de pastillas"
  ];

  // FUNCIONES PARA LA EDICIÓN DE REPARACIÓN

  // Abre el formulario de edición cargando los datos de la reparación seleccionada.
  // En producción, se podría obtener más información del backend si es necesario.
  const handleEditarReparacion = (cita) => {
    setCitaSeleccionada(cita);
    setComentario(cita.comentario || "");
    setExtra(0);
    setTempCost(cita.costo);
    // Se separan los servicios por saltos de línea para trabajarlos individualmente
    const serviciosIniciales = cita.servicio ? cita.servicio.split("\n") : [];
    setTempServices(serviciosIniciales);
    setServiciosExtra("");
    setSuggestions([]);
  };

  // Funciones para ajustar el costo de la reparación agregando o restando un valor extra
  const handleSumarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => prevCost + extraVal);
    setExtra(0);
  };

  const handleRestarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => {
      const newCost = prevCost - extraVal;
      return newCost < 0 ? 0 : newCost;
    });
    setExtra(0);
  };

  // Maneja el cambio en el campo de servicio extra y muestra sugerencias basadas en allowedServices.
  // El backend también debería validar este campo.
  const handleServicioExtraChange = (e) => {
    const inputValue = e.target.value;
    setServiciosExtra(inputValue);
    if (inputValue.trim() !== "") {
      const filtered = allowedServices.filter((service) =>
        service.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Al seleccionar una sugerencia, se establece el servicio extra
  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion);
    setSuggestions([]);
  };

  // Agrega un servicio extra a la lista de servicios de la reparación en edición.
  // Se validan duplicados y servicios no permitidos.
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

  // Permite quitar un servicio extra de la lista
  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  // Guarda los cambios en la reparación.
  // Aquí es donde se actualizaría el registro mediante una llamada PUT/PATCH a la API del backend.
  const handleGuardarReparacion = () => {
    if (!citaSeleccionada) return;
    const serviciosFinales = tempServices.join("\n");
    const citaActualizada = {
      ...citaSeleccionada,
      comentario,
      costo: tempCost,
      servicio: serviciosFinales
    };
    // Actualiza el estado local. En el backend, se debería actualizar la base de datos.
    const nuevasCitas = citas.map((c) =>
      c.id === citaSeleccionada.id ? citaActualizada : c
    );
    setCitas(nuevasCitas);
    cerrarFormulario();
  };

  // Reinicia el formulario de edición
  const cerrarFormulario = () => {
    setCitaSeleccionada(null);
    setComentario("");
    setExtra(0);
    setServiciosExtra("");
    setTempCost(0);
    setTempServices([]);
    setSuggestions([]);
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    cerrarFormulario();
  };

  // FUNCIONES PARA LA ELIMINACIÓN CON MODAL PERSONALIZADO

  // Abre el modal de confirmación de eliminación y guarda la reparación a eliminar
  const handleEliminarReparacion = (cita) => {
    setDeleteTarget(cita);
    setShowDeleteModal(true);
  };

  // Confirma la eliminación.
  // Aquí se debería realizar una llamada DELETE al backend para eliminar el registro.
  // Además, si la reparación eliminada está siendo editada, se cierra el formulario.
  const confirmDelete = () => {
    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== deleteTarget.id));
    if (citaSeleccionada && citaSeleccionada.id === deleteTarget.id) {
      cerrarFormulario();
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Cancela la eliminación y cierra el modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Función de utilidad para normalizar cadenas (útil para búsquedas sin sensibilidad a mayúsculas)
  const normalizeStr = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Genera breadcrumbs dinámicos a partir de los filtros activos
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

  // Maneja la navegación a través de los breadcrumbs
  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  // Funciones para manejar los filtros de búsqueda avanzados
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type.trim() !== "" &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  // Filtra las reparaciones según la búsqueda y los filtros aplicados.
  // En una aplicación real, el backend podría procesar estos filtros y devolver los registros pertinentes.
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
      return normalizeStr(String(citaField)).includes(normalizeStr(filter.value));
    });
    return matchesSearch && matchesAdvanced;
  });

  return (
    <div>
      <Breadcrumbs paths={dynamicBreadcrumbs} onCrumbClick={handleBreadcrumbClick} />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Administrar Reparaciones</h1>
          {/* Sección de búsqueda y filtros */}
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
                    onChange={(e) => handleFilterChange(index, "type", e.target.value)}
                    className="form-input w-64 text-right"
                  >
                    <option value="">Selecciona tipo de filtro</option>
                    {availableFilterTypes
                      .filter((type) => {
                        if (filter.type === type) return true;
                        return !filters.some((f, i) => i !== index && f.type === type);
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
                    onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                    className="form-input w-64 text-right"
                  />
                  {filters.length > 1 && (
                    <button onClick={() => handleRemoveFilter(index)} className="textError" type="button">
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              {filters.length < 3 &&
                filters[filters.length - 1].type.trim() !== "" &&
                filters[filters.length - 1].value.trim() !== "" && (
                  <button onClick={handleAddFilter} className="button-yellow w-40" type="button">
                    Agregar Filtro
                  </button>
                )}
            </div>
          </div>
          {/* Sección de listado de reparaciones */}
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
                    {cita.empleado && (
                      <div className="mb-1">
                        <span className="detalle-label">Empleado: </span>
                        <span className="detalle-costo">{cita.empleado}</span>
                      </div>
                    )}
                    {cita.fechaGuardado && (
                      <div className="mb-1">
                        <span className="detalle-label">Fecha guardado: </span>
                        <span className="detalle-costo">{cita.fechaGuardado}</span>
                      </div>
                    )}
                    {/* Botones para editar y eliminar la reparación */}
                    <button
                      type="button"
                      className="btn-aceptar w-full mt-2"
                      onClick={() => handleEditarReparacion(cita)}
                    >
                      Editar Reparación
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar mt-2"
                      onClick={() => handleEliminarReparacion(cita)}
                    >
                      Eliminar Reparación
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
 
          {/* Formulario de edición de reparación */}
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
                  <span className="detalle-label">Costo Nuevo: </span>
                  <span className="detalle-costo">${tempCost}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <button type="button" className="btn-aceptar mt-2" onClick={handleGuardarReparacion}>
                  Guardar
                </button>
                <button type="button" className="btn-cancelar mt-2" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Modal de confirmación de eliminación personalizado */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            {/* Títulos y textos con colores personalizados.
                Aquí se ha indicado "Confirmar Eliminación" en amarillo, y
                los textos "cliente" y "empleado" en amarillo, mientras el resto del texto es blanco.
                Para lograr estos estilos, se pueden usar clases CSS personalizadas.
            */}
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Confirmar Eliminación
            </h3>
            <p className="mb-4">
              <span className="text-white">¿Está seguro de eliminar la reparación de </span>
              <strong className="text-yellow-500">{deleteTarget?.cliente}</strong>
              <span className="text-white"> realizada por </span>
              <strong className="text-yellow-500">{deleteTarget?.empleado}</strong>
              <span className="text-white">?</span>
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn-aceptar" onClick={cancelDelete}>
                Cancelar
              </button>
              <button className="btn-cancelar" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrudReparacionesAdmin;

