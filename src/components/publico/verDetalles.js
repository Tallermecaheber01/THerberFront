import React from "react";

const servicio = {
  id: 1,
  titulo: "Cambio de Aceite",
  descripcion:
    "Mantén tu motor protegido con un cambio de aceite profesional. Este servicio incluye la extracción del aceite usado, cambio de filtro de aceite y llenado con aceite nuevo de alta calidad. Recomendado para prolongar la vida útil de tu motor y garantizar un desempeño óptimo.",
  categoria:
    "Mantenimiento",
    imagen:
    "https://blog.reparacion-vehiculos.es/hs-fs/hubfs/Im%C3%A1genes_Post/Julio%202018/errores%20cambio-aceite.jpg?width=1200&name=errores%20cambio-aceite.jpg",
  costo: "$500 MXN",
  duracion: "30 minutos",
};

function verDetalles() {
  return (
    <section className="services-section">
      <div className="detalle-container">
        <img src={servicio.imagen} alt={servicio.titulo} className="detalle-img" />
        <div className="detalle-content">
          <h2 className="detalle-title">{servicio.titulo}</h2>
          <p className="detalle-descripcion">{servicio.descripcion}</p>
          <p className="detalle-costo">
            <span className="detalle-label">Costo:</span> {servicio.costo}
          </p>
          <p className="detalle-duracion">
            <span className="detalle-label">Categoria:</span> {servicio.categoria}
          </p>
          <p className="detalle-duracion">
            <span className="detalle-label">Duración aproximado:</span> {servicio.duracion}
          </p>
        </div>
      </div>
    </section>
  );
}

export default verDetalles;
