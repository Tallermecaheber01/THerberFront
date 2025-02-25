import React, { useState } from "react";
import Breadcrumbs from "../Breadcrumbs";

function CitasCanceladas() {
  // Breadcrumbs fijos para la navegación
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Citas Canceladas", link: "/citascanceladas" }
  ];

  // Datos de las citas canceladas.
  // "canceladoPor" indica si la cancelación fue realizada por un "empleado" o un "cliente".
  // Si es "empleado", se mostrará el nombre del empleado en "empleadoCancelador".
  const [citas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      servicio: "Cambio de aceite",
      fecha: "2025-01-05",
      hora: "10:00",
      canceladoPor: "empleado",
      empleadoCancelador: "Pablo",
      mensajeCancelacion: "El cliente canceló por enfermedad.",
      fechaCancelacion: "2025-01-04"
    },
    {
      id: 2,
      cliente: "María Gómez",
      servicio: "Revisión general",
      fecha: "2025-01-06",
      hora: "12:00",
      canceladoPor: "cliente",
      mensajeCancelacion: "Ya no necesito el servicio.",
      fechaCancelacion: "2025-01-05"
    },
    {
      id: 3,
      cliente: "Carlos López",
      servicio: "Cambio de llantas",
      fecha: "2025-01-05",
      hora: "14:00",
      canceladoPor: "empleado",
      empleadoCancelador: "Pedro",
      mensajeCancelacion: "Se encontró una falla en el vehículo.",
      fechaCancelacion: "2025-01-05"
    }
  ]);

  // Estados para manejar filtros avanzados y búsqueda básica.
  // "filters" es un arreglo de objetos con propiedades "type" y "value" para cada filtro.
  // "searchQuery" almacena el texto ingresado en la búsqueda básica.
  const [filters, setFilters] = useState([{ type: "", value: "" }]);
  const [searchQuery, setSearchQuery] = useState("");

  // Función que normaliza cadenas eliminando acentos y convirtiendo a minúsculas,
  // para facilitar comparaciones insensibles.
  const normalizeStr = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Genera los breadcrumbs dinámicos combinando los fijos con los filtros activos.
  // Cada filtro activo se convierte en un breadcrumb que muestra el tipo y el valor.
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type.trim() !== "" && filter.value.trim() !== ""
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name:
        filter.type === "nombreCancelador"
          ? "Nombre del cancelador: " + filter.value
          : filter.type.charAt(0).toUpperCase() +
            filter.type.slice(1) +
            ": " +
            filter.value,
      link: "#"
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  // Guarda los breadcrumbs dinámicos generados.
  const dynamicBreadcrumbs = getDynamicBreadcrumbs();

  // Maneja el clic en un breadcrumb.
  // Si se hace clic en uno de los breadcrumbs fijos, se reinician los filtros y la búsqueda.
  // Si se hace clic en un breadcrumb dinámico, se eliminan los filtros posteriores a ese.
  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  // Actualiza el valor de un filtro (ya sea el tipo o el valor) en un índice específico.
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro al arreglo si el último filtro está completo.
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

  // Elimina un filtro del arreglo en el índice especificado.
  // Si se eliminan todos los filtros, se agrega uno vacío por defecto.
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  // Filtra las citas canceladas.
  // Se aplica la búsqueda básica (searchQuery) y cada uno de los filtros avanzados activos.
  const filteredCitas = citas.filter((cita) => {
    // Verifica si la cita coincide con la búsqueda básica en cualquiera de sus propiedades.
    const matchesSearch =
      searchQuery === "" ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    // Verifica que la cita cumpla con cada filtro avanzado.
    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === "" || filter.value.trim() === "") return true;
      if (filter.type === "canceladoPor") {
        // Para el filtro "canceladoPor", se realiza una comparación exacta.
        return normalizeStr(cita.canceladoPor) === normalizeStr(filter.value);
      } else if (filter.type === "nombreCancelador") {
        // Para "nombreCancelador", se verifica si el nombre del empleado cancelador incluye el valor.
        return (
          cita.empleadoCancelador &&
          normalizeStr(cita.empleadoCancelador).includes(
            normalizeStr(filter.value)
          )
        );
      } else {
        // Para otros filtros, se compara el campo correspondiente en la cita.
        const fieldValue = cita[filter.type];
        if (!fieldValue) return false;
        return normalizeStr(String(fieldValue)).includes(
          normalizeStr(filter.value)
        );
      }
    });
    return matchesSearch && matchesAdvanced;
  });

  // Opciones base para los tipos de filtros.
  // Se permite filtrar por "cliente", "servicio" o "canceladoPor".
  const baseFilterOptions = ["cliente", "servicio", "canceladoPor"];
  // Verifica si ya existe un filtro de "canceladoPor".
  const hasCanceladoPor = filters.some((f) => f.type === "canceladoPor");
  // Inicializa las opciones disponibles para los filtros.
  let filterOptions = [...baseFilterOptions];
  // Si existe un filtro de "canceladoPor" y aún no se ha agregado "nombreCancelador",
  // se añade "nombreCancelador" como opción adicional.
  if (hasCanceladoPor && !filters.some((f) => f.type === "nombreCancelador")) {
    filterOptions.push("nombreCancelador");
  }

  return (
    <div>
      {/* Renderiza los breadcrumbs dinámicos y asigna el manejador para clics */}
      <Breadcrumbs
        paths={dynamicBreadcrumbs}
        onCrumbClick={handleBreadcrumbClick}
      />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Consultar Citas Canceladas</h1>
          {/* Sección de filtros avanzados y búsqueda básica */}
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {/* Muestra el input de búsqueda básica si no hay filtros activos */}
            {filters.length === 1 &&
              filters[0].type.trim() === "" &&
              filters[0].value.trim() === "" && (
                <input
                  type="text"
                  placeholder="Buscar citas canceladas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-72 text-right"
                />
              )}
            <div className="flex flex-col gap-4 items-end">
              {/* Itera sobre cada filtro para renderizar su select/input correspondiente */}
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
                    {filterOptions
                      .filter((type) => {
                        // Permite seleccionar la misma opción si ya está asignada en este filtro,
                        // o si no ha sido usada en otro filtro.
                        if (filter.type === type) return true;
                        return !filters.some(
                          (f, i) => i !== index && f.type === type
                        );
                      })
                      .map((type) => (
                        <option key={type} value={type}>
                          {type === "nombreCancelador"
                            ? "Nombre del cancelador"
                            : type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>
                  {/* Dependiendo del tipo de filtro, muestra un select o un input */}
                  {filter.type === "canceladoPor" ? (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      className="form-input w-64 text-right"
                    >
                      <option value="">Selecciona</option>
                      <option value="empleado">Empleado</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Busqueda"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, "value", e.target.value)
                      }
                      className="form-input w-64 text-right"
                    />
                  )}
                  {/* Botón para eliminar el filtro si hay más de uno */}
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
              {/* Botón para agregar un nuevo filtro si el último está completo y no se excede el máximo */}
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

          {/* Sección para mostrar el listado de citas canceladas filtradas */}
          <div className="mt-8">
            <h2 className="cita-title text-center">Citas Canceladas</h2>
            {filteredCitas.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCitas.map((cita) => (
                  <div key={cita.id} className="reparacion-card card-transition">
                    {/* Muestra la información de cada cita cancelada */}
                    <div className="mb-2">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{cita.cliente}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Servicio: </span>
                      <span className="detalle-costo">{cita.servicio}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Fecha de la cita: </span>
                      <span className="detalle-costo">{cita.fecha}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Cancelado por:  </span>
                      {cita.canceladoPor === "cliente" ? (
                        <span className="detalle-costo">Cliente</span>
                      ) : (
                        <>
                          <span className="detalle-costo">Empleado </span>
                          <span className="detalle-costo">
                            {cita.empleadoCancelador}
                          </span>
                        </>
                      )}
                    </div>
                    {cita.mensajeCancelacion && (
                      <div className="mb-2">
                        <span className="detalle-label">
                          Mensaje de cancelación:{" "}
                        </span>
                        <span className="detalle-costo">
                          {cita.mensajeCancelacion}
                        </span>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="detalle-label">
                        Fecha de cancelación:{" "}
                      </span>
                      <span className="detalle-costo">
                        {cita.fechaCancelacion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Muestra un mensaje de advertencia si no se encontraron citas con los filtros aplicados.
              <p className="advertencia">
                No se encontraron citas canceladas con los filtros aplicados.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CitasCanceladas;
