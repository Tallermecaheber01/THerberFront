import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const servicios = [
  {
    id: 1,
    titulo: "Cambio de Aceite",
    descripcion: "Mantén tu motor protegido con un cambio de aceite profesional.",
    imagen:
      "https://blog.reparacion-vehiculos.es/hs-fs/hubfs/Im%C3%A1genes_Post/Julio%202018/errores%20cambio-aceite.jpg?width=1200&name=errores%20cambio-aceite.jpg",
    categoria: "Mantenimiento"
  },
  {
    id: 2,
    titulo: "Revisión de Frenos",
    descripcion: "Garantiza tu seguridad con un diagnóstico completo de frenos.",
    imagen: "https://motor.elpais.com/wp-content/uploads/2019/09/Frenos-1046x616.jpg",
    categoria: "Seguridad"
  },
  {
    id: 3,
    titulo: "Alineación y Balanceo",
    descripcion: "Logra mayor estabilidad y rendimiento con nuestro servicio de alineación.",
    imagen:
      "https://assets.firestonetire.com/content/dam/consumer/fst/la/mx/tips/tecnologia-de-llantas/Alineacion_big-1.jpg",
    categoria: "Suspensión"
  },
  {
    id: 4,
    titulo: "Reparación de Transmisión",
    descripcion:
      "Diagnóstico y reparación de transmisiones con tecnología avanzada.",
    imagen:
      "https://blog.transtec.com/hs-fs/hubfs/Blog%20Images/rebuild-transmissions-in-house.jpg?width=531&height=266&name=rebuild-transmissions-in-house.jpg",
    categoria: "Transmisión"
  },
  {
    id: 5,
    titulo: "Sistema de Enfriamiento",
    descripcion:
      "Revisión y reparación del sistema de enfriamiento para evitar sobrecalentamientos.",
    imagen:
      "https://www.grupoherres.com.mx/wp-content/uploads/2019/05/sistema-enfriamiento-aire.jpg",
    categoria: "Motor"
  },
  {
    id: 6,
    titulo: "Revisión de Suspensión",
    descripcion: "Diagnóstico y ajuste de la suspensión para una conducción suave.",
    imagen:
      "https://cms-gauib.s3.eu-central-1.amazonaws.com/noticias/imagenes/amortiguadores_1606255548.jpg?v=1",
    categoria: "Suspensión"
  },
  {
    id: 7,
    titulo: "Reparación de Clutch",
    descripcion: "Reparación y mantenimiento del clutch para un mejor desempeño.",
    imagen: "https://framerusercontent.com/images/5lGGFkVUAO7rSgFep2yVEXERaYk.jpg",
    categoria: "Transmisión"
  },
  {
    id: 8,
    titulo: "Sistema Eléctrico",
    descripcion: "Diagnóstico y reparación de problemas eléctricos en tu vehículo.",
    imagen:
      "https://aprende.com/wp-content/uploads/2022/12/que-es-el-sistema-electrico-de-un-automovil.jpg",
    categoria: "Eléctrico"
  },
  {
    id: 9,
    titulo: "Cambio de Llantas",
    descripcion: "Cambio y alineación de llantas para una mejor experiencia al conducir.",
    imagen:
      "https://www.misterllantas.com/media/magefan_blog/Cambio-de-Lllantas.jpg",
    categoria: "Mantenimiento"
  }
];

function ConsultaServicios() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);

    const nuevasSugerencias = servicios
      .map((servicio) => servicio.titulo)
      .filter((titulo) => titulo.toLowerCase().includes(valor));
    setSugerencias(nuevasSugerencias.slice(0, 5));
  };

  const seleccionarSugerencia = (sugerencia) => {
    setBusqueda(sugerencia);
    setSugerencias([]);
  };

  const handleCategoryChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleClickOutside = (e) => {
    // Si se hace clic fuera del input o la lista, cerrar sugerencias
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setSugerencias([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredServices = servicios.filter((servicio) => {
    if (!busqueda && !categoria) return true; // Mostrar todos si no hay filtros
    const matchesSearch =
      servicio.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategory = categoria ? servicio.categoria === categoria : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-title">Catálogo de Servicios</h2>

        <div className="max-w-screen-lg p-8 flex justify-end relative">
          <div className="relative" ref={inputRef}>
            <input
              type="text"
              placeholder="Buscar servicios"
              value={busqueda}
              onChange={handleSearchChange}
              className="form-input w-72 mr-4"
            />
            {sugerencias.length > 0 && (
              <ul className="absolute bg-white border rounded w-72 max-h-40 overflow-y-auto">
                {sugerencias.map((sugerencia, index) => (
                  <li
                    key={index}
                    onClick={() => seleccionarSugerencia(sugerencia)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                  >
                    {sugerencia}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <select
            value={categoria}
            onChange={handleCategoryChange}
            className="form-input w-64"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Suspensión">Suspensión</option>
            <option value="Transmisión">Transmisión</option>
            <option value="Motor">Motor</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>
        </div>

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
                  <button className="button-yellow mt-4">Ver más detalles</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConsultaServicios;
