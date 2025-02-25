import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

// Componente para la aprobación y rechazo de citas pendientes
function AprobacionesCitas() {
  const navigate = useNavigate();

  // Estado inicial: lista de citas pendientes (cada cita tiene información relevante)
  const [citas, setCitas] = useState([
    { 
      id: 1, 
      referencia: 'CITA001', 
      estado: 'pendiente', 
      razonRechazo: '', 
      modelo: 'Corolla 2020', 
      marca: 'Toyota', 
      fecha: '2025-03-01', 
      hora: '09:00 AM', 
      serviciosSolicitados: ['Cambio de aceite', 'Revisión de frenos'], 
      cliente: 'Juan Pérez', 
      total: 0 
    },
    { 
      id: 2, 
      referencia: 'CITA002', 
      estado: 'pendiente', 
      razonRechazo: '', 
      modelo: 'F-150 2021', 
      marca: 'Ford', 
      fecha: '2025-03-02', 
      hora: '02:00 PM', 
      serviciosSolicitados: ['Cambio de batería', 'Revisión de suspensión'], 
      cliente: 'María Gómez', 
      total: 0 
    },
    // Se pueden agregar más citas según sea necesario
  ]);

  // Estados para manejar la cita seleccionada y la información de aprobación/rechazo
  const [selectedCita, setSelectedCita] = useState(null); // Cita actualmente seleccionada para ver detalles
  const [total, setTotal] = useState(""); // Total ingresado al aprobar la cita
  const [isRejectionMode, setIsRejectionMode] = useState(false); // Modo de rechazo activo
  const [razonRechazo, setRazonRechazo] = useState(""); // Razón de rechazo de la cita
  const [selectedEmpleado, setSelectedEmpleado] = useState(""); // Empleado asignado al aprobar la cita

  // Estados para la búsqueda simple y filtros avanzados
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Aprobaciones de Citas", link: "/aprobacioncitas" }
  ];
  const [filters, setFilters] = useState([{ type: "", value: "" }]); // Filtros avanzados (máximo 3)
  const [searchQuery, setSearchQuery] = useState(""); // Consulta de búsqueda simple

  // Opciones disponibles para los filtros avanzados
  const availableFilterTypes = ["marca", "cliente", "servicio"];
  // Obtiene los tipos de filtro ya aplicados para evitar duplicados
  const appliedFilterTypes = filters.map((filter) => filter.type);
  // Opciones específicas según el tipo de filtro
  const optionsByFilter = {
    marca: ["Toyota", "Ford", "Chevrolet", "Honda", "Nissan"],
    servicio: [
      "Cambio de aceite",
      "Revisión de frenos",
      "Cambio de batería",
      "Revisión de suspensión",
      "Reparación de aire acondicionado"
    ]
  };

  // Función para generar breadcrumbs dinámicos combinando los fijos con filtros activos
  const getDynamicBreadcrumbs = () => {
    // Se filtran solo los filtros que tienen tipo y valor no vacío
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ""
    );
    // Se crea un breadcrumb por cada filtro activo
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: `${filter.type}: ${filter.value}`,
      link: "#"
    }));
    // Se combinan los breadcrumbs fijos con los dinámicos
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  // Maneja el clic en un breadcrumb, permitiendo regresar a un estado previo
  const handleBreadcrumbClick = (index) => {
    // Si se hace clic en un breadcrumb fijo, se reinician filtros y búsqueda
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
      navigate(staticBreadcrumbs[index].link);
    } else {
      // Para breadcrumbs dinámicos, se actualizan los filtros hasta ese índice
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters((prevFilters) => prevFilters.slice(0, filterIndex + 1));
    }
  };

  // Actualiza el valor o tipo de un filtro en una posición específica
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = {
      ...newFilters[index],
      [field]: value
    };
    // Si se cambia el tipo de filtro, se reinicia el valor
    if (field === "type") newFilters[index].value = "";
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro si el último filtro tiene ambos campos completos y el total de filtros es menor a 3
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  // Elimina un filtro específico de la lista de filtros
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    // Si se eliminan todos los filtros, se agrega uno vacío por defecto
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  // Filtra las citas según:
  // 1. Que su estado sea "pendiente"
  // 2. Que coincidan con la búsqueda simple (searchQuery)
  // 3. Que cumplan con los filtros avanzados definidos
  const filteredCitas = citas.filter((cita) => {
    if (cita.estado !== "pendiente") return false;

    // Verifica si la cita coincide con la búsqueda simple en alguno de sus campos
    const matchesSearch =
      searchQuery === "" ||
      Object.values(cita).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

    // Verifica si la cita cumple todos los filtros avanzados aplicados
    const matchesFilters = filters.every((filter) => {
      if (!filter.type || !filter.value) return true;
      const field = filter.type.toLowerCase();
      // Para el filtro "servicio", se evalúa el arreglo de servicios solicitados
      if (field === "servicio") {
        return (
          cita.serviciosSolicitados &&
          cita.serviciosSolicitados.join(" ").toLowerCase().includes(filter.value.toLowerCase())
        );
      }
      // Para otros filtros, se compara directamente el campo de la cita
      return cita[field]?.toLowerCase().includes(filter.value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  // Efecto que reinicia la selección de cita si la cita seleccionada ya no está en la lista filtrada
  useEffect(() => {
    if (
      selectedCita &&
      !filteredCitas.some((cita) => cita.id === selectedCita.id)
    ) {
      setSelectedCita(null);
    }
  }, [filteredCitas, selectedCita]);

  // Función para seleccionar una cita de la lista (mostrando sus detalles para aprobación/rechazo)
  const handleSelectCita = (id) => {
    const cita = citas.find((c) => c.id === id);
    setSelectedCita(cita);
    // Reinicia los estados de total, modo de rechazo, razón y empleado al seleccionar una nueva cita
    setTotal("");
    setIsRejectionMode(false);
    setRazonRechazo("");
    setSelectedEmpleado("");
  };

  // Función para cancelar la selección y reiniciar estados
  const handleCancelSelection = () => {
    setSelectedCita(null);
    setTotal("");
    setIsRejectionMode(false);
    setRazonRechazo("");
    setSelectedEmpleado("");
  };

  // Función para aprobar la cita:
  // Valida que se haya ingresado un total y seleccionado un empleado,
  // luego actualiza el estado de la cita a "aprobada" y asigna el total ingresado.
  const handleApprove = () => {
    if (total.trim() === "") {
      alert("Por favor, ingrese un total.");
      return;
    }
    if (selectedEmpleado === "") {
      alert("Por favor, seleccione un empleado.");
      return;
    }
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === selectedCita.id
          ? { ...cita, estado: "aprobada", total: Number(total) }
          : cita
      )
    );
    alert(
      `Cita ${selectedCita.referencia} aprobada asignando al empleado ${selectedEmpleado}.`
    );
    setSelectedCita(null);
  };

  // Activa el modo de rechazo para la cita seleccionada
  const handleEnterRejection = () => {
    setIsRejectionMode(true);
  };

  // Confirma el rechazo de la cita:
  // Valida que la razón de rechazo no sea solo numérica y actualiza el estado de la cita a "rechazada"
  const handleConfirmRejection = () => {
    if (razonRechazo.trim() !== "" && /^\d+$/.test(razonRechazo.trim())) {
      alert("La razón de rechazo no puede contener solo números.");
      return;
    }
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === selectedCita.id
          ? { ...cita, estado: "rechazada", razonRechazo }
          : cita
      )
    );
    alert(
      `Cita ${selectedCita.referencia} rechazada${
        razonRechazo.trim() ? " por: " + razonRechazo : ""
      }`
    );
    setSelectedCita(null);
  };

  // Cancela el modo de rechazo, reiniciando el campo de razón de rechazo
  const handleCancelRejection = () => {
    setRazonRechazo("");
    setIsRejectionMode(false);
  };

  return (
    <div>
      {/* Renderiza los breadcrumbs dinámicos, pasando la función para manejar clics */}
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <div className="form-container">
        {/* Área para la búsqueda simple y filtros avanzados */}
        <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
          {/* Muestra el input de búsqueda simple solo si no hay filtros avanzados activos */}
          {filters.length === 1 && filters[0].value.trim() === "" && (
            <input
              type="text"
              placeholder="Buscar citas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-72"
            />
          )}
          {/* Sección de filtros avanzados */}
          <div className="flex flex-col items-end space-y-6">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex flex-wrap gap-4 justify-end items-center"
              >
                {/* Select para elegir el tipo de filtro */}
                <select
                  value={filter.type}
                  onChange={(e) =>
                    handleFilterChange(index, "type", e.target.value)
                  }
                  className="form-input w-64"
                >
                  <option value="">Consulta avanzada</option>
                  {availableFilterTypes
                    .filter(
                      (type) =>
                        !appliedFilterTypes.includes(type) || type === filter.type
                    )
                    .map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                </select>

                {/* Dependiendo del tipo de filtro seleccionado, se muestra un input o select */}
                {filter.type && (
                  filter.type === "cliente" ? (
                    // Input de texto para filtro de cliente
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      className="form-input w-64"
                      placeholder="Escribe el cliente"
                    />
                  ) : (
                    // Select para filtros con opciones predefinidas (marca, servicio)
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      className="form-input w-64"
                    >
                      <option value="">
                        Selecciona {filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}
                      </option>
                      {optionsByFilter[filter.type].map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  )
                )}

                {/* Botón para eliminar el filtro si hay más de uno */}
                {filters.length > 1 && (
                  <button
                    onClick={() => handleRemoveFilter(index)}
                    className="textError"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            {/* Botón para agregar un nuevo filtro si se cumple la condición */}
            {filters.length < 3 &&
              filters[filters.length - 1].type &&
              filters[filters.length - 1].value.trim() !== "" && (
                <div className="w-full flex justify-end">
                  <button
                    onClick={handleAddFilter}
                    className="button-yellow w-40"
                  >
                    Agregar Filtro
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Listado de citas filtradas presentadas en forma de tarjetas */}
        {!selectedCita && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitas.map((cita) => (
              <div
                key={cita.id}
                className="reparacion-card cursor-pointer"
                onClick={() => handleSelectCita(cita.id)}
              >
                <h2 className="cita-title">{cita.referencia}</h2>
                <p className="cita-subtitle">Modelo: {cita.modelo}</p>
                <p className="cita-subtitle">Marca: {cita.marca}</p>
                <p className="cita-subtitle">Cliente: {cita.cliente}</p>
                <p className="cita-subtitle">
                  Fecha: {cita.fecha} - Hora: {cita.hora}
                </p>
                <p className="cita-subtitle">
                  Servicios: {cita.serviciosSolicitados.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Detalle de la cita seleccionada, con opciones para aprobar o rechazar */}
        {selectedCita && (
          <div className="reparacion-card">
            {/* Botón para cancelar la selección y volver al listado */}
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-cancelar w-fit text-xs px-3 py-2"
                onClick={handleCancelSelection}
              >
                X
              </button>
            </div>
            {/* Detalles de la cita */}
            <div className="detalle-descripcion">
              <h2 className="cita-title">{selectedCita.referencia}</h2>
              <p className="cita-subtitle">Modelo: {selectedCita.modelo}</p>
              <p className="cita-subtitle">Marca: {selectedCita.marca}</p>
              <p className="cita-subtitle">Cliente: {selectedCita.cliente}</p>
              <p className="cita-subtitle">
                Fecha: {selectedCita.fecha} - Hora: {selectedCita.hora}
              </p>
              <p className="cita-subtitle">
                Servicios solicitados: {selectedCita.serviciosSolicitados.join(", ")}
              </p>
            </div>
            {/* Sección para aprobación (ingresar total y seleccionar empleado) o rechazo (razón de rechazo) */}
            {!isRejectionMode && (
              <>
                <div className="form-group">
                  <label htmlFor="total" className="form-label">
                    Total:
                  </label>
                  <input
                    id="total"
                    type="number"
                    className="form-input"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="Ingrese total"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="empleado" className="form-label">
                    Empleado:
                  </label>
                  <select
                    id="empleado"
                    className="form-input"
                    value={selectedEmpleado}
                    onChange={(e) => setSelectedEmpleado(e.target.value)}
                  >
                    <option value="">Seleccione un trabajador</option>
                    <option value="Trabajador 1">Pedro</option>
                    <option value="Trabajador 2">Pablo</option>
                    <option value="Trabajador 3">Matias</option>
                  </select>
                </div>
              </>
            )}
            {isRejectionMode && (
              <div className="form-group">
                <label htmlFor="razon" className="form-label">
                  Razón de rechazo:
                </label>
                <textarea
                  id="razon"
                  className="form-input"
                  value={razonRechazo}
                  onChange={(e) => setRazonRechazo(e.target.value)}
                  placeholder="Ingrese la razón del rechazo (no solo números)"
                  rows="4"
                />
              </div>
            )}
            {/* Botones para confirmar la acción: aprobar o rechazar */}
            <div className="flex gap-4 mt-4">
              {isRejectionMode ? (
                <>
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleConfirmRejection}
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleCancelRejection}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleApprove}
                  >
                    Aprobar Cita
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleEnterRejection}
                  >
                    Rechazar Cita
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AprobacionesCitas;

