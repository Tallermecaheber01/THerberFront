import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function ConsultarCitas() {
  // Breadcrumbs fijos para la navegación de la aplicación.
  // Estos se usan para indicar la ruta de navegación en la interfaz.
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Consultar Citas", link: "/consultarcitas" }
  ];

  // Datos de ejemplo de las citas (simulados para este componente).
  // Cada objeto "cita" contiene información relevante que el backend debería conocer,
  // como el cliente, servicio, fecha, hora, costo y detalles del vehículo (marca y modelo).
  const [citas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      servicio: "Cambio de aceite",
      fecha: "2025-01-05",
      hora: "10:00",
      costo: 50,
      marca: "Toyota",
      modelo: "Corolla 2019"
    },
    {
      id: 2,
      cliente: "María Gómez",
      servicio: "Revisión general",
      fecha: "2025-01-06",
      hora: "12:00",
      costo: 75,
      marca: "Honda",
      modelo: "Civic 2018"
    },
    {
      id: 3,
      cliente: "Carlos López",
      servicio: "Cambio de llantas",
      fecha: "2025-01-05",
      hora: "14:00",
      costo: 100,
      marca: "Ford",
      modelo: "Focus 2020"
    }
  ]);

  // Estados para manejar los filtros avanzados y la búsqueda básica.
  // "filters" es un arreglo de objetos donde cada objeto tiene un "type" (el campo a filtrar)
  // y un "value" (el valor de búsqueda para ese campo).
  // "searchQuery" es el término de búsqueda general que se aplica a todas las propiedades de una cita.
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");

  // Lista de tipos de filtro disponibles que se mostrarán en el select.
  // Estos corresponden a los campos de una cita.
  const availableFilterTypes = [
    "cliente",
    "servicio",
    "marca",
    "modelo",
    "costo"
  ];

  // Función de utilidad para normalizar cadenas:
  // Elimina acentos y convierte la cadena a minúsculas para que las búsquedas sean insensibles a mayúsculas/minúsculas y acentos.
  const normalizeStr = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Genera breadcrumbs dinámicos combinando los breadcrumbs fijos con los filtros activos.
  // Esto permite al usuario ver y eliminar filtros aplicados.
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type.trim() !== "" && filter.value.trim() !== ""
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      // Se capitaliza el tipo y se muestra el valor para cada filtro.
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
  // Si se hace clic en un breadcrumb dinámico (filtrado), se mantienen solo los filtros anteriores.
  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  // Actualiza un filtro específico (ya sea su "type" o "value") en la posición dada.
  // Esto permite modificar los criterios de filtrado en tiempo real.
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro si el último filtro está completamente definido (ambos campos llenos).
  // Se limita a un máximo de 3 filtros.
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type.trim() !== "" &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  // Elimina un filtro en la posición especificada.
  // Si se eliminan todos los filtros, se reinicia con un filtro vacío.
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  // Filtra la lista de citas usando la búsqueda básica y los filtros avanzados.
  // Se normalizan las cadenas para hacer las comparaciones de manera insensible.
  const filteredCitas = citas.filter((cita) => {
    // "matchesSearch" verifica si alguna propiedad de la cita contiene el término de búsqueda.
    const matchesSearch =
      searchQuery === "" ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    // "matchesAdvanced" verifica cada filtro aplicado.
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

  // Función para finalizar el servicio de una cita.
  // Se almacena la cita seleccionada en localStorage para que la próxima página
  // (RegistroReparacion) pueda recuperarla y mostrar los detalles para su edición.
  const handleFinalizarServicio = (citaSeleccionada) => {
    localStorage.setItem("selectedCita", JSON.stringify(citaSeleccionada));
    window.location.href = "/registroreparaciones";
  };

  // Función para registrar una reparación extra (sin cita previa).
  // Elimina cualquier cita almacenada en localStorage y redirige a la página de registro,
  // donde se mostrará un mensaje indicando que no se ha seleccionado una cita.
  const handleReparacionExtra = () => {
    localStorage.removeItem("selectedCita");
    window.location.href = "/registroreparaciones";
  };

  return (
    <div>
      {/* Se renderizan los breadcrumbs dinámicos con su manejador de clic */}
      <Breadcrumbs
        paths={dynamicBreadcrumbs}
        onCrumbClick={handleBreadcrumbClick}
      />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Consultar Citas Próximas</h1>
          {/* Sección para la búsqueda básica y filtros avanzados */}
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {/* Si no hay filtros activos, se muestra el input de búsqueda */}
            {filters.length === 1 &&
              filters[0].type.trim() === "" &&
              filters[0].value.trim() === "" && (
                <input
                  type="text"
                  placeholder="Buscar citas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-72 text-right"
                />
              )}
            <div className="flex flex-col gap-4 items-end">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center">
                  {/* Select para elegir el tipo de filtro */}
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
                        // Permite mantener el filtro si ya está seleccionado en este campo
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
                  {/* Input para ingresar el valor del filtro.
                      Si el tipo es "costo", se usa un input numérico. */}
                  <input
                    type={
                      filter.type.toLowerCase() === "costo" ? "number" : "text"
                    }
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

          {/* Sección para mostrar el listado de citas filtradas */}
          <div className="mt-8">
            <h2 className="cita-title text-center">Citas Programadas</h2>
            {filteredCitas.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCitas.map((cita) => (
                  <div key={cita.id} className="reparacion-card">
                    <div className="mb-2">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{cita.cliente}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Servicio: </span>
                      <span className="detalle-costo">{cita.servicio}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Fecha: </span>
                      <span className="detalle-costo">{cita.fecha}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>
                    {cita.costo !== undefined && (
                      <div className="mb-2">
                        <span className="detalle-label">Costo: </span>
                        <span className="detalle-costo">${cita.costo}</span>
                      </div>
                    )}
                    {cita.marca && (
                      <div className="mb-2">
                        <span className="detalle-label">Marca: </span>
                        <span className="detalle-costo">{cita.marca}</span>
                      </div>
                    )}
                    {cita.modelo && (
                      <div className="mb-2">
                        <span className="detalle-label">Modelo: </span>
                        <span className="detalle-costo">{cita.modelo}</span>
                      </div>
                    )}
                    {/* Botón que permite finalizar el servicio, almacenando la cita seleccionada para editarla en otra pantalla. */}
                    <button
                      type="button"
                      className="btn-aceptar w-full mt-2"
                      onClick={() => handleFinalizarServicio(cita)}
                    >
                      Finalizar Servicio
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia">
                No se encontraron citas con los filtros aplicados.
              </p>
            )}
          </div>
          {/* Botón para registrar una reparación extra (sin cita previa) */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="btn-aceptar"
              onClick={handleReparacionExtra}
            >
              Registrar una Reparación Extra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsultarCitas;
