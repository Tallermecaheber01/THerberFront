import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function CrudReparacionesAdmin() {
  // Breadcrumbs estáticos para la navegación de la vista administrativa
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Administrar Reparaciones", link: "/AdminReparaciones" }
  ];

  // Estado inicial de las reparaciones (citas)
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
      empleado: "Ana Torres",
      fechaGuardado: "2025-01-04"
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
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState("");
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Estado para filtros de búsqueda
  const availableFilterTypes = ["cliente", "servicio", "marca", "modelo", "costo", "empleado"];
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // NUEVO: Estado para el modal de confirmación de edición
  const [showEditModal, setShowEditModal] = useState(false);

  // Lista de servicios permitidos para autocompletar
  const allowedServices = [
    "Cambio de aceite",
    "Revisión general",
    "Cambio de llantas",
    "Afinación",
    "Cambio de pastillas"
  ];

  // FUNCIONES PARA LA EDICIÓN DE REPARACIÓN
  const handleEditarReparacion = (cita) => {
    setCitaSeleccionada(cita);
    setComentario(cita.comentario || "");
    setExtra(0);
    const serviciosIniciales = cita.servicio ? cita.servicio.split("\n") : [];
    setTempCost(cita.costo);
    setTempServices(serviciosIniciales);
    setServiciosExtra("");
    setSuggestions([]);
  };

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

  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion);
    setSuggestions([]);
  };

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

  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  // Función que guarda los cambios en la reparación
  const handleGuardarReparacion = () => {
    if (!citaSeleccionada) return;
    const serviciosFinales = tempServices.join("\n");
    const citaActualizada = {
      ...citaSeleccionada,
      comentario,
      costo: tempCost,
      servicio: serviciosFinales
    };
    const nuevasCitas = citas.map((c) =>
      c.id === citaSeleccionada.id ? citaActualizada : c
    );
    setCitas(nuevasCitas);
    cerrarFormulario();
  };

  // NUEVA: Función que se invoca al confirmar la edición desde el modal
  const confirmEdit = () => {
    handleGuardarReparacion();
    setShowEditModal(false);
  };

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

  // FUNCIONES PARA LA ELIMINACIÓN CON MODAL
  const handleEliminarReparacion = (cita) => {
    setDeleteTarget(cita);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== deleteTarget.id));
    if (citaSeleccionada && citaSeleccionada.id === deleteTarget.id) {
      cerrarFormulario();
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const normalizeStr = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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

  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

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
                  <div key={cita.id} className="reparacion-card p-4 rounded-md card-transition">
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
                {/* En lugar de guardar directamente, se abre el modal de confirmación */}
                <button type="button" className="btn-aceptar mt-2" onClick={() => setShowEditModal(true)}>
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Confirmar Eliminación
            </h3>
            <p className="mb-4">
              ¿Está seguro de eliminar la reparación de{" "}
              <strong className="text-yellow-500">{deleteTarget?.cliente}</strong> realizada por{" "}
              <strong className="text-yellow-500">{deleteTarget?.empleado}</strong>?
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

      {/* Modal de confirmación de edición */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Confirmación de Edición
            </h3>
            <p className="mb-4">
              ¿Está seguro de guardar los cambios en la reparación de{" "}
              <strong className="text-yellow-500">{citaSeleccionada?.cliente}</strong> realizada por{" "}
              <strong className="text-yellow-500">{citaSeleccionada?.empleado}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn-aceptar" onClick={confirmEdit}>
                Guardar
              </button>
              <button className="btn-cancelar" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrudReparacionesAdmin;
