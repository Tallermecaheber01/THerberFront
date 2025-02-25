import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

function Consulta_cita() {
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Consulta cita", link: "/consultacita" }
  ];

  const [citas, setCitas] = useState([
    {
      id: 1,
      trabajador: "Pedro Cruz",
      horario: "10:00 AM - 11:00 AM",
      ubicacion: "Sucursal Centro",
      servicio: "Cambio de aceite"
    },
    {
      id: 2,
      trabajador: "Juan Pérez",
      horario: "12:00 PM - 01:00 PM",
      ubicacion: "Sucursal Norte",
      servicio: "Revisión de frenos"
    },
    {
      id: 3,
      trabajador: "Jesus Lopéz",
      horario: "02:00 PM - 3:00 PM",
      ubicacion: "Sucursal Sur",
      servicio: "Alineación y balanceo"
    },
    {
      id: 4,
      trabajador: "Juan Pérez",
      horario: "03:30 PM - 04:30 PM",
      ubicacion: "Sucursal Este",
      servicio: "Cambio de batería"
    },
    {
      id: 5,
      trabajador: "Juan Pérez",
      horario: "05:00 PM - 06:00 PM",
      ubicacion: "Sucursal Oeste",
      servicio: "Revisión general"
    }
  ]);

  const [selectedCita, setSelectedCita] = useState(null);
  // Estado de filtros avanzados: se inicia con un objeto vacío para mostrar la UI de filtros
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState(""); // Búsqueda simple

  const navigate = useNavigate();

  // Genera los breadcrumbs combinando los fijos con aquellos derivados de filtros activos
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ""
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: filter.type,
      link: "#" // El link es ficticio; la acción se maneja en el onCrumbClick
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  // Al hacer clic en un breadcrumb:
  // - Si es un breadcrumb fijo ("Inicio" o "Consulta cita"), se reinician los filtros y la búsqueda.
  // - Si es un breadcrumb de filtro, se eliminan los filtros que vengan después del seleccionado.
  const handleBreadcrumbClick = (index) => {
    console.log("Se hizo clic en el breadcrumb con índice:", index);
    if (index < staticBreadcrumbs.length) {
      // Reinicia los filtros (dejándolos en estado inicial) y la búsqueda simple.
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
      navigate(staticBreadcrumbs[index].link);
    } else {
      // Índice relativo en el array de filtros activos:
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters((prevFilters) => prevFilters.slice(0, filterIndex + 1));
    }
  };

  // Funciones de navegación y acciones sobre las citas
  const handleAgregarCita = () => {
    navigate("/agregarCita");
  };

  const handleCambiarCita = (id) => {
    navigate(`/cambiarCita`);
  };

  const handleCancelarCita = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (confirmar) {
      setCitas(citas.filter((cita) => cita.id !== id));
      alert("Cita cancelada con éxito.");
      setSelectedCita(null);
    }
  };

  const handleVerDetalles = (id) => {
    setSelectedCita(citas.find((cita) => cita.id === id));
  };

  const handleCerrarDetalles = () => {
    setSelectedCita(null);
  };

  // Actualiza un filtro específico según el índice, el campo ("type" o "value") y el nuevo valor
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = {
      ...newFilters[index],
      [field]: value
    };
    if (field === "type") newFilters[index].value = ""; // Reinicia el valor si se cambia el tipo
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro si el último ya tiene ambos campos completos y se permite hasta 3 filtros
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  // Elimina un filtro en particular
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    // Si se elimina el último filtro y queda vacío, se vuelve a inicializar con un objeto vacío
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  const availableFilterTypes = ["trabajador", "servicio", "ubicacion"];
  const appliedFilterTypes = filters.map((filter) => filter.type);

  // Filtra las citas según la búsqueda simple y los filtros avanzados activos
  const filteredCitas = citas.filter((cita) => {
    return (
      // Búsqueda simple: se revisa cada valor de la cita
      (searchQuery === "" ||
        Object.values(cita).some((value) => {
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })) &&
      // Filtros avanzados: se evalúa cada filtro activo
      filters.every((filter) => {
        if (!filter.type || !filter.value) return true;
        const field = filter.type.toLowerCase();
        return cita[field]?.toLowerCase().includes(filter.value.toLowerCase());
      })
    );
  });

  // Si la cita seleccionada ya no se encuentra entre las citas filtradas, se cierra la vista de detalles.
  useEffect(() => {
    if (
      selectedCita &&
      !filteredCitas.some((cita) => cita.id === selectedCita.id)
    ) {
      setSelectedCita(null);
    }
  }, [filteredCitas, selectedCita]);

  return (
    <div>
      {/* Breadcrumbs dinámicos */}
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <div className="services-section">
        <div className="services-container">
          <h2 className="services-title">Citas del Mes</h2>

          {/* Área de búsqueda y filtros */}
          <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
            {/* Se muestra la búsqueda simple cuando se tiene un único filtro sin valor */}
            {filters.length === 1 && filters[0].value.trim() === "" && (
              <input
                type="text"
                placeholder="Buscar citas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-72"
              />
            )}

            {/* UI de filtros avanzados */}
            <div className="flex flex-col items-end space-y-6">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-4 justify-end items-center"
                >
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

                  {filter.type && (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      className="form-input w-64"
                    >
                      <option value="">
                        Selecciona{" "}
                        {filter.type.charAt(0).toUpperCase() +
                          filter.type.slice(1)}
                      </option>
                      {(() => {
                        const optionsByFilter = {
                          trabajador: ["Pedro Cruz", "Juan Pérez", "Jesus Lopéz"],
                          servicio: [
                            "Cambio de aceite",
                            "Revisión de frenos",
                            "Alineación y balanceo",
                            "Cambio de batería",
                            "Revisión general"
                          ],
                          ubicacion: [
                            "Sucursal Centro",
                            "Sucursal Norte",
                            "Sucursal Sur",
                            "Sucursal Este",
                            "Sucursal Oeste"
                          ]
                        };
                        return optionsByFilter[filter.type].map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ));
                      })()}
                    </select>
                  )}

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

          {/* Listado de citas filtradas */}
          <div className="services-grid">
            {filteredCitas.map((cita) => (
              <div key={cita.id} className="service-card card-transition">
                <div className="service-card-content">
                  <h3 className="service-card-title">{cita.trabajador}</h3>
                  <p className="service-card-text">Horario: {cita.horario}</p>
                  <p className="service-card-text">Ubicación: {cita.ubicacion}</p>
                  <button
                    className="btn-blue"
                    onClick={() => handleVerDetalles(cita.id)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detalles de la cita seleccionada */}
          {selectedCita && (
            <div className="bg-cardClaro dark:bg-cardObscuro rounded-lg p-6 mt-8">
              <div className="detalle-content">
                <h3 className="detalle-title">Detalles de la Cita</h3>
                <p className="detalle-descripcion">
                  <strong>Atención por el empleado:</strong> {selectedCita.trabajador}
                </p>
                <p className="detalle-descripcion">
                  <strong>Horario:</strong> {selectedCita.horario}
                </p>
                <p className="detalle-descripcion">
                  <strong>Ubicación:</strong> {selectedCita.ubicacion}
                </p>
                <p className="detalle-descripcion">
                  <strong>Servicio:</strong> {selectedCita.servicio}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    className="btn-blue"
                    onClick={() => handleCambiarCita(selectedCita.id)}
                  >
                    Cambiar Cita
                  </button>
                  <button
                    className="button-yellow"
                    onClick={() => handleCancelarCita(selectedCita.id)}
                  >
                    Cancelar Cita
                  </button>
                  <button className="btn-cancelar" onClick={handleCerrarDetalles}>
                    Cerrar detalles
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-center w-1/2 mx-auto">
              <button className="btn-aceptar" onClick={handleAgregarCita}>
                Agregar Nueva Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consulta_cita;
