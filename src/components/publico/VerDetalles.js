import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { getServiceById } from '../../api/admin';

function VerDetalles() {
  // Se extrae el id de la URL
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [error, setError] = useState(null);

  // Breadcrumbs estáticos para navegación
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Servicios', link: '/consultaservicios' },
    { name: 'Detalles', link: `/verDetalles/${id}` },
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        // getServiceById debe recibir el id y devolver los datos del servicio
        const data = await getServiceById(id);
        // Se asume que la API retorna un arreglo y se toma el primer elemento,
        // o directamente un objeto si así está implementado la API.
        const servicioData = Array.isArray(data) ? data[0] : data;
        setServicio(servicioData);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Error al cargar los detalles del servicio.');
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!servicio) return <div>Cargando...</div>;

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <section className="services-section">
        <div className="detalle-container">
          <img
            src={servicio.imagen}
            alt={servicio.nombre}
            className="detalle-img"
          />
          <div className="detalle-content">
            <h2 className="detalle-title">{servicio.nombre}</h2>
            <p className="detalle-descripcion">{servicio.descripcion}</p>
            {/* Si la API trae más propiedades como costo, categoría o duración, se pueden mostrar aquí */}
            {servicio.costo && (
              <p className="detalle-costo">
                <span className="detalle-label">Costo:</span> {servicio.costo}
              </p>
            )}
            {servicio.categoria && (
              <p className="detalle-duracion">
                <span className="detalle-label">Categoría:</span> {servicio.categoria}
              </p>
            )}
            {servicio.duracion && (
              <p className="detalle-duracion">
                <span className="detalle-label">Duración aproximada:</span> {servicio.duracion}
              </p>
            )}
            {servicio.tipoVehiculo && (
              <p className="detalle-duracion">
                <span className="detalle-label">Tipo de Vehículo:</span> {servicio.tipoVehiculo.join(', ')}
              </p>
            )}
            {servicio.marcas && (
              <p className="detalle-duracion">
                <span className="detalle-label">Marcas:</span> {servicio.marcas.join(', ')}
              </p>
            )}
            {servicio.modelos && (
              <p className="detalle-duracion">
                <span className="detalle-label">Modelos:</span> {servicio.modelos.join(', ')}
              </p>
            )}
            <div className="detalle-boton">
              <Link to="/consultaservicios">
                <button className="btn-aceptar w-auto text-sm py-2 px-1">
                  Volver al catalogo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerDetalles;
