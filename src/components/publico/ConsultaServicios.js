import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

// Array de servicios (sin cambios)
const servicios = [
  {
    id: 1,
    titulo: "Cambio de Aceite",
    descripcion: "Mantén tu motor protegido con un cambio de aceite profesional.",
    imagen:
      "https://blog.reparacion-vehiculos.es/hs-fs/hubfs/Im%C3%A1genes_Post/Julio%202018/errores%20cambio-aceite.jpg?width=1200&name=errores%20cambio-aceite.jpg",
    categoria: "Mantenimiento",
    tipoVehiculo: "Coche",
    marca: "Toyota"
  },
  {
    id: 2,
    titulo: "Revisión de Frenos",
    descripcion: "Garantiza tu seguridad con un diagnóstico completo de frenos.",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbe0LG5fHYYYu2eBceASDMx0A53W8BoA0Dt-MVXIXUTixWhvbedU2KLWznUYYUgW1ZDoQ&usqp=CAU",
    categoria: "Seguridad",
    tipoVehiculo: "Coche",
    marca: "Ford"
  },
  {
    id: 3,
    titulo: "Alineación y Balanceo",
    descripcion: "Logra mayor estabilidad y rendimiento con nuestro servicio de alineación.",
    imagen:
      "https://assets.firestonetire.com/content/dam/consumer/fst/la/mx/tips/tecnologia-de-llantas/Alineacion_big-1.jpg",
    categoria: "Suspensión",
    tipoVehiculo: "Camioneta",
    marca: "Chevrolet"
  },
  {
    id: 4,
    titulo: "Reparación de Transmisión",
    descripcion: "Diagnóstico y reparación de transmisiones con tecnología avanzada.",
    imagen:
      "https://blog.transtec.com/hs-fs/hubfs/Blog%20Images/rebuild-transmissions-in-house.jpg?width=531&height=266&name=rebuild-transmissions-in-house.jpg",
    categoria: "Transmisión",
    tipoVehiculo: "Coche",
    marca: "Nissan"
  },
  {
    id: 5,
    titulo: "Sistema de Enfriamiento",
    descripcion:
      "Revisión y reparación del sistema de enfriamiento para evitar sobrecalentamientos.",
    imagen:
      "https://www.grupoherres.com.mx/wp-content/uploads/2019/05/sistema-enfriamiento-aire.jpg",
    categoria: "Motor",
    tipoVehiculo: "SUV",
    marca: "BMW"
  },
  {
    id: 6,
    titulo: "Revisión de Suspensión",
    descripcion: "Diagnóstico y ajuste de la suspensión para una conducción suave.",
    imagen:
      "https://cms-gauib.s3.eu-central-1.amazonaws.com/noticias/imagenes/amortiguadores_1606255548.jpg?v=1",
    categoria: "Suspensión",
    tipoVehiculo: "Camioneta",
    marca: "Chevrolet"
  },
  {
    id: 7,
    titulo: "Reparación de Clutch",
    descripcion: "Reparación y mantenimiento del clutch para un mejor desempeño.",
    imagen: "https://framerusercontent.com/images/5lGGFkVUAO7rSgFep2yVEXERaYk.jpg",
    categoria: "Transmisión",
    tipoVehiculo: "Coche",
    marca: "Honda"
  },
  {
    id: 8,
    titulo: "Sistema Eléctrico",
    descripcion: "Diagnóstico y reparación de problemas eléctricos en tu vehículo.",
    imagen:
      "https://aprende.com/wp-content/uploads/2022/12/que-es-el-sistema-electrico-de-un-automovil.jpg",
    categoria: "Eléctrico",
    tipoVehiculo: "Coche",
    marca: "Toyota"
  },
  {
    id: 9,
    titulo: "Cambio de Llantas",
    descripcion: "Cambio y alineación de llantas para una mejor experiencia al conducir.",
    imagen:
      "https://www.misterllantas.com/media/magefan_blog/Cambio-de-Lllantas.jpg",
    categoria: "Mantenimiento",
    tipoVehiculo: "SUV",
    marca: "Ford"
  }
];

// Opciones de filtros disponibles
const filtrosDisponibles = {
  categoria: {
    label: "Categoría",
    options: [
      "Mantenimiento",
      "Seguridad",
      "Suspensión",
      "Transmisión",
      "Motor",
      "Eléctrico"
    ]
  },
  tipoVehiculo: {
    label: "Tipo de Vehículo",
    options: ["Coche", "Camioneta", "SUV"]
  },
  marca: {
    label: "Marca",
    options: ["Toyota", "Ford", "Chevrolet", "Nissan", "BMW", "Honda"]
  }
};

function ConsultaServicios() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Breadcrumbs estáticos (fijos)
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Servicios", link: "/consultaservicios" }
  ];

  // Estado para búsqueda simple
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para filtros avanzados; se inicia con un objeto vacío para mostrar la UI de filtros
  const [filters, setFilters] = useState([{ type: "", value: "" }]);

  // Activa el modo avanzado si hay algún filtro con datos
  const advancedActive = filters.some(f => f.type && f.value.trim() !== "");

  // Función que genera los breadcrumbs dinámicos combinando los estáticos con los filtros activos
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ""
    );
    // Cada breadcrumb derivado mostrará el label definido en filtrosDisponibles para ese filtro
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: filtrosDisponibles[filter.type].label,
      link: "#" // Link ficticio; la acción se manejará en el callback onCrumbClick
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  // Maneja el clic en un breadcrumb
  const handleBreadcrumbClick = (index) => {
    console.log("Se hizo clic en el breadcrumb con índice:", index);
    if (index < staticBreadcrumbs.length) {
      // Si se hace clic en "Inicio" o "Servicios", reiniciamos filtros y búsqueda y navegamos a la ruta
      setFilters([{ type: "", value: "" }]);
      setSearchQuery("");
      navigate(staticBreadcrumbs[index].link);
    } else {
      // Si se hace clic en un breadcrumb derivado de un filtro, eliminamos los filtros que estén después del clic
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters((prevFilters) => prevFilters.slice(0, filterIndex + 1));
    }
  };

  // Función para actualizar un filtro (ya sea el tipo o el valor)
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    if (field === "type") newFilters[index].value = ""; // Reinicia el valor si se cambia el tipo
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro si el último ya está completo y se permite hasta 3 filtros
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
      filters[filters.length - 1].value.trim() !== ""
    ) {
      setFilters([...filters, { type: "", value: "" }]);
    }
  };

  // Elimina un filtro específico
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    // Si se eliminan todos los filtros, se vuelve a dejar el estado inicial para mostrar la UI
    if (newFilters.length === 0) newFilters.push({ type: "", value: "" });
    setFilters(newFilters);
  };

  const appliedFilterTypes = filters.map(filter => filter.type);

  // Filtrado de servicios según la búsqueda simple o los filtros avanzados
  const filteredServices = advancedActive
    ? servicios.filter(servicio =>
        filters.every(filter => {
          if (!filter.type || !filter.value.trim()) return true;
          return servicio[filter.type]
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        })
      )
    : servicios.filter(servicio => {
        if (searchQuery.trim() === "") return true;
        return (
          servicio.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          servicio.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

  return (
    <div>
      {/* Breadcrumbs dinámicos: se pasan los paths generados y el callback para clic */}
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <section className="services-section">
        <div className="services-container">
          <h2 className="services-title">Catálogo de Servicios</h2>

          <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
            {/* Se muestra la búsqueda simple cuando no hay filtros avanzados */}
            {filters.length === 1 && filters[0].value.trim() === "" && (
              <input
                type="text"
                placeholder="Buscar servicios"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={inputRef}
                className="form-input w-72"
              />
            )}

            {/* Área de filtros avanzados */}
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
                    <option value="">Selecciona filtro</option>
                    {Object.keys(filtrosDisponibles)
                      .filter(
                        (key) =>
                          !appliedFilterTypes.includes(key) || key === filter.type
                      )
                      .map((key) => (
                        <option key={key} value={key}>
                          {filtrosDisponibles[key].label}
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
                        Selecciona {filtrosDisponibles[filter.type].label}
                      </option>
                      {filtrosDisponibles[filter.type].options.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
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

          {/* Listado de servicios filtrados */}
          <div className="services-grid">
            {filteredServices.map((servicio) => (
              <div key={servicio.id} className="service-card">
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="service-card-img"
                />
                <div className="service-card-content">
                  <h3 className="service-card-title">{servicio.titulo}</h3>
                  <p className="service-card-text">{servicio.descripcion}</p>
                  <Link to={`/verDetalles`}>
                    <button className="button-yellow mt-4">
                      Ver más detalles
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConsultaServicios;

