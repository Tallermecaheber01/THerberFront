import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

function Consulta_cita() {
  const [citas, setCitas] = useState([
    {
      id: 1,
      trabajador: "Pedro Cruz",
      horario: "10:00 AM - 11:00 AM",
      ubicacion: "Sucursal Centro",
      servicio: "Cambio de aceite",
    },
    {
      id: 2,
      trabajador: "Juan Pérez",
      horario: "12:00 PM - 01:00 PM",
      ubicacion: "Sucursal Norte",
      servicio: "Revisión de frenos",
    },
    {
      id: 3,
      trabajador: "Jesus Lopéz",
      horario: "02:00 PM - 3:00 PM",
      ubicacion: "Sucursal Sur",
      servicio: "Alineación y balanceo",
    },
    {
      id: 4,
      trabajador: "Juan Pérez",
      horario: "03:30 PM - 04:30 PM",
      ubicacion: "Sucursal Este",
      servicio: "Cambio de batería",
    },
    {
      id: 5,
      trabajador: "Juan Pérez",
      horario: "05:00 PM - 06:00 PM",
      ubicacion: "Sucursal Oeste",
      servicio: "Revisión general",
    },
  ]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [filters, setFilters] = useState([{ type: "", value: "" }]); // Filtros
  const [searchQuery, setSearchQuery] = useState(""); // Búsqueda

  const navigate = useNavigate();

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

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    if (field === "type") newFilters[index].value = ""; // Resetear valor si cambia el tipo
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    setFilters([...filters, { type: "", value: "" }]);
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const availableFilterTypes = ["trabajador", "servicio", "ubicacion"];

  const appliedFilterTypes = filters.map((filter) => filter.type);
  const filteredCitas = citas.filter((cita) => {
    return (
      // Filtro de búsqueda simple
      (searchQuery === "" ||
        Object.values(cita).some((value) => {
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })) &&
      // Filtros
      filters.every((filter) => {
        if (!filter.type || !filter.value) return true; // Por si no hay filtro
        const field = filter.type.toLowerCase();
        return cita[field]?.toLowerCase().includes(filter.value.toLowerCase());
      })
    );
  });

  return (
    <div className="services-section">
      <div className="services-container">
        <Breadcrumbs paths={[]} />
        <h2 className="services-title">Citas del Mes</h2>

        {/* Esto es para los filtros */}
        <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
            {filters.length <= 1 && filters[0].value.trim() === "" && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar citas"
                className="form-input w-72"
              />
            )}
          <div className="flex flex-col items-end space-y-6">
            {filters.map((filter, index) => (
              <div key={index} className="flex flex-wrap gap-4 justify-end items-center">
                <select
                  value={filter.type}
                  onChange={(e) => handleFilterChange(index, "type", e.target.value)}
                  className="form-input w-64"
                >
                  <option value="">Selecciona un filtro</option>
                  {availableFilterTypes
                    .filter((type) => !appliedFilterTypes.includes(type) || type === filter.type)
                    .map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                </select>

                {filter.type && (
                  <input
                    type="text"
                    placeholder={`Buscar por ${filter.type}`}
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                    className="form-input w-64"
                  />
                )}

                {filters.length > 1 && (
                  <button onClick={() => handleRemoveFilter(index)} className="textError">
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            {filters.length < 3 && filters[filters.length - 1].value.trim() !== "" && (
              <div className="w-full flex justify-end">
                <button onClick={handleAddFilter} className="button-yellow w-40">
                  Agregar Filtro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Citas filtradas */}
        <div className="services-grid">
          {filteredCitas.map((cita) => (
            <div key={cita.id} className="service-card">
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

        {selectedCita && (
          <div className="bg-cardClaro dark:bg-cardObscuro rounded-lg p-6 mt-8">
            <div className="detalle-content">
              <h3 className="detalle-title">Detalles de la Cita</h3>
              <p className="detalle-descripcion">
                <strong>Atencion por el empleado:</strong> {selectedCita.trabajador}
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
  );
}

export default Consulta_cita;
