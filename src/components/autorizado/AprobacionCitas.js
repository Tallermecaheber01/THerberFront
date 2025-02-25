import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

function AprobacionesCitas() {
  const navigate = useNavigate();

  // Lista inicial de citas (pendientes)
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
    // Otras citas...
  ]);

  // Estados para la cita seleccionada y sus campos de aprobación/rechazo
  const [selectedCita, setSelectedCita] = useState(null);
  const [total, setTotal] = useState("");
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [isRejectionMode, setIsRejectionMode] = useState(false);
  const [razonRechazo, setRazonRechazo] = useState("");

  // Estados para mensajes de error en los inputs de aprobación/rechazo
  const [approvalErrors, setApprovalErrors] = useState({});

  // Estado para mostrar el modal de confirmación de aprobación
  const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false);

  // Breadcrumbs estáticos y estados para filtros y búsqueda (más adelante)
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Aprobaciones de Citas", link: "/aprobacioncitas" }
  ];
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const availableFilterTypes = ["marca", "cliente", "servicio"];
  const appliedFilterTypes = filters.map((filter) => filter.type);
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

  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ""
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: `${filter.type}: ${filter.value}`,
      link: "#"
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
      navigate(staticBreadcrumbs[index].link);
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    if (field === "type") newFilters[index].value = "";
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
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
    if (cita.estado !== "pendiente") return false;
    const matchesSearch =
      searchQuery === "" ||
      Object.values(cita).some((value) => {
        if (typeof value === "string")
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        else if (Array.isArray(value))
          return value.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
        return false;
      });
    const matchesFilters = filters.every((filter) => {
      if (!filter.type || !filter.value) return true;
      const field = filter.type.toLowerCase();
      if (field === "servicio") {
        return (
          cita.serviciosSolicitados &&
          cita.serviciosSolicitados.join(" ").toLowerCase().includes(filter.value.toLowerCase())
        );
      }
      return cita[field]?.toLowerCase().includes(filter.value.toLowerCase());
    });
    return matchesSearch && matchesFilters;
  });

  useEffect(() => {
    if (
      selectedCita &&
      !filteredCitas.some((cita) => cita.id === selectedCita.id)
    ) {
      setSelectedCita(null);
    }
  }, [filteredCitas, selectedCita]);

  const handleSelectCita = (id) => {
    const cita = citas.find((c) => c.id === id);
    setSelectedCita(cita);
    setTotal("");
    setSelectedEmpleado("");
    setIsRejectionMode(false);
    setRazonRechazo("");
    setApprovalErrors({});
  };

  const handleCancelSelection = () => {
    setSelectedCita(null);
    setTotal("");
    setSelectedEmpleado("");
    setIsRejectionMode(false);
    setRazonRechazo("");
    setApprovalErrors({});
  };

  // Función para prevenir inyecciones SQL en los textos
  const isInputSecure = (value) => {
    if (
      value.includes("'") ||
      value.includes('"') ||
      value.includes(";") ||
      value.includes("--") ||
      value.includes("/*") ||
      value.includes("*/")
    ) {
      return false;
    }
    return true;
  };

  // Función que se ejecuta al intentar aprobar la cita.
  // Realiza validaciones para que el total sea un número positivo y se haya seleccionado un empleado,
  // y verifica que los valores no contengan caracteres peligrosos.
  const handleAttemptApprove = () => {
    const errors = {};
    if (total.trim() === "") {
      errors.total = "El total es obligatorio.";
    } else if (isNaN(total)) {
      errors.total = "El total debe ser un número.";
    } else if (parseFloat(total) < 0) {
      errors.total = "El total no puede ser negativo.";
    }
    if (selectedEmpleado.trim() === "") {
      errors.selectedEmpleado = "Debe seleccionar un empleado.";
    }
    // (Opcional) Validamos que los valores no tengan caracteres peligrosos
    if (!isInputSecure(total)) {
      errors.total = "El total contiene caracteres no permitidos.";
    }
    if (!isInputSecure(selectedEmpleado)) {
      errors.selectedEmpleado = "El empleado seleccionado contiene caracteres no permitidos.";
    }
    if (Object.keys(errors).length > 0) {
      setApprovalErrors(errors);
      return;
    }
    setApprovalErrors({});
    setShowConfirmApproveModal(true);
  };

  // Al confirmar la aprobación en el modal, se actualiza la cita
  const confirmApprove = () => {
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === selectedCita.id
          ? { ...cita, estado: "aprobada", total: Number(total) }
          : cita
      )
    );
    setShowConfirmApproveModal(false);
    setSelectedCita(null);
    setTotal("");
    setSelectedEmpleado("");
    setApprovalErrors({});
  };

  const handleEnterRejection = () => {
    setIsRejectionMode(true);
    setApprovalErrors({});
  };

  // En el rechazo se valida que la razón no sea solo numérica y que no contenga caracteres peligrosos
  const handleConfirmRejection = () => {
    if (razonRechazo.trim() !== "" && /^\d+$/.test(razonRechazo.trim())) {
      setApprovalErrors({ razonRechazo: "La razón de rechazo no puede contener solo números." });
      return;
    }
    if (!isInputSecure(razonRechazo)) {
      setApprovalErrors({ razonRechazo: "La razón de rechazo contiene caracteres no permitidos." });
      return;
    }
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === selectedCita.id
          ? { ...cita, estado: "rechazada", razonRechazo }
          : cita
      )
    );
    setSelectedCita(null);
    setApprovalErrors({});
  };

  const handleCancelRejection = () => {
    setRazonRechazo("");
    setIsRejectionMode(false);
    setApprovalErrors({});
  };

  return (
    <div>
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <div className="form-container">
        {/* Área de búsqueda simple y filtros avanzados */}
        <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
          {filters.length === 1 && filters[0].value.trim() === "" && (
            <input
              type="text"
              placeholder="Buscar citas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-72"
            />
          )}
          <div className="flex flex-col items-end space-y-6">
            {filters.map((filter, index) => (
              <div key={index} className="flex flex-wrap gap-4 justify-end items-center">
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
                {filter.type &&
                  (filter.type === "cliente" ? (
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
                  ))}
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
              filters[filters.length - 1].type &&
              filters[filters.length - 1].value.trim() !== "" && (
                <div className="w-full flex justify-end">
                  <button onClick={handleAddFilter} className="button-yellow w-40">
                    Agregar Filtro
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Listado de citas en forma de tarjetas */}
        {!selectedCita && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitas.map((cita) => (
              <div
                key={cita.id}
                className="reparacion-card cursor-pointer card-transition"
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

        {/* Detalle de la cita seleccionada */}
        {selectedCita && (
          <div className="reparacion-card">
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-cancelar w-fit text-xs px-3 py-2"
                onClick={handleCancelSelection}
              >
                X
              </button>
            </div>
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
            {/* Sección de aprobación o rechazo */}
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
                  {approvalErrors.total && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.total}
                    </p>
                  )}
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
                    <option value="Pedro">Pedro</option>
                    <option value="Pablo">Pablo</option>
                    <option value="Matias">Matias</option>
                  </select>
                  {approvalErrors.selectedEmpleado && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.selectedEmpleado}
                    </p>
                  )}
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
                {approvalErrors.razonRechazo && (
                  <p className="text-red-500 text-xs mt-1">
                    {approvalErrors.razonRechazo}
                  </p>
                )}
              </div>
            )}
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
                    onClick={handleAttemptApprove}
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

      {/* Modal de confirmación para aprobar la cita */}
      {showConfirmApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl  mb-4 text-yellow-500">
              Confirmación de Aprobación
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Está seguro de aprobar la cita con total de $
              {total} y asignar al empleado {selectedEmpleado}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn-aceptar"
                onClick={() => setShowConfirmApproveModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-cancelar" onClick={confirmApprove}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AprobacionesCitas;
