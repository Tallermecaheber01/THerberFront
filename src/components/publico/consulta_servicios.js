import React from "react";

const servicios = [
  {
    id: 1,
    titulo: "Cambio de Aceite",
    descripcion: "Mantén tu motor protegido con un cambio de aceite profesional.",
    imagen:
      "https://blog.reparacion-vehiculos.es/hs-fs/hubfs/Im%C3%A1genes_Post/Julio%202018/errores%20cambio-aceite.jpg?width=1200&name=errores%20cambio-aceite.jpg",
  },
  {
    id: 2,
    titulo: "Revisión de Frenos",
    descripcion: "Garantiza tu seguridad con un diagnóstico completo de frenos.",
    imagen:
      "https://motor.elpais.com/wp-content/uploads/2019/09/Frenos-1046x616.jpg",
  },
  {
    id: 3,
    titulo: "Alineación y Balanceo",
    descripcion:
      "Logra mayor estabilidad y rendimiento con nuestro servicio de alineación.",
    imagen:
      "https://assets.firestonetire.com/content/dam/consumer/fst/la/mx/tips/tecnologia-de-llantas/Alineacion_big-1.jpg",
  },
  {
    id: 4,
    titulo: "Reparación de Transmisión",
    descripcion:
      "Diagnóstico y reparación de transmisiones con tecnología avanzada.",
    imagen:
      "https://blog.transtec.com/hs-fs/hubfs/Blog%20Images/rebuild-transmissions-in-house.jpg?width=531&height=266&name=rebuild-transmissions-in-house.jpg",
  },
  {
    id: 5,
    titulo: "Sistema de Enfriamiento",
    descripcion:
      "Revisión y reparación del sistema de enfriamiento para evitar sobrecalentamientos.",
    imagen:
      "https://www.grupoherres.com.mx/wp-content/uploads/2019/05/sistema-enfriamiento-aire.jpg",
  },
  {
    id: 6,
    titulo: "Revisión de Suspensión",
    descripcion:
      "Diagnóstico y ajuste de la suspensión para una conducción suave.",
    imagen:
      "https://cms-gauib.s3.eu-central-1.amazonaws.com/noticias/imagenes/amortiguadores_1606255548.jpg?v=1",
  },
  {
    id: 7,
    titulo: "Reparación de Clutch",
    descripcion:
      "Reparación y mantenimiento del clutch para un mejor desempeño.",
    imagen:
      "https://framerusercontent.com/images/5lGGFkVUAO7rSgFep2yVEXERaYk.jpg",
  },
  {
    id: 8,
    titulo: "Sistema Eléctrico",
    descripcion:
      "Diagnóstico y reparación de problemas eléctricos en tu vehículo.",
    imagen:
      "https://aprende.com/wp-content/uploads/2022/12/que-es-el-sistema-electrico-de-un-automovil.jpg",
  },
  {
    id: 9,
    titulo: "Cambio de Llantas",
    descripcion:
      "Cambio y alineación de llantas para una mejor experiencia al conducir.",
    imagen:
      "https://www.misterllantas.com/media/magefan_blog/Cambio-de-Lllantas.jpg",
  },
];

function consulta_servicios() {
  return (
    <section className="services-section">
      <div className="services-container">
        <h2 className="services-title">Catálogo de Servicios</h2>
        <div className="services-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="service-card">
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="service-card-img"
              />
              <div className="service-card-content">
                <h3 className="service-card-title">{servicio.titulo}</h3>
                <p className="service-card-text">{servicio.descripcion}</p>
                <button className="button-yellow mt-4">
                  Ver más detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default consulta_servicios;
