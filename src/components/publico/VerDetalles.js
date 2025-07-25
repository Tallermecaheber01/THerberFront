import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { getServiceById } from '../../api/admin';

function VerDetalles() {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = location.state?.serviceId;
  const [servicio, setServicio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      navigate('/consultaservicios');
    }
  }, [serviceId, navigate]);

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Servicios', link: '/consultaservicios' },
    { name: 'Detalles', link: '#' },
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(serviceId);
        const servicioData = Array.isArray(data) ? data[0] : data;
        setServicio(servicioData);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Error al cargar los detalles del servicio.');
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  if (!serviceId) return null;
  if (error) return <div>{error}</div>;
  if (!servicio) return <div>Cargando...</div>;

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <section className="services-section">
        <div className="detalle-container">
          <img src={servicio.imagen} alt={servicio.nombre} className="detalle-img" />
          <div className="detalle-content">
            <h2 className="navbar-title">{servicio.nombre}</h2>
            <p className="detalle-descripcion">{servicio.descripcion}</p>

            {servicio.costo && (
              <p className="detalle-costo">
                <span className="detalle-label">Costo:</span> {servicio.costo}
              </p>
            )}
            {servicio.categoria && (
              <p className="detalle-informacion">
                <span className="detalle-label">Categoría:</span> {servicio.categoria}
              </p>
            )}
            {servicio.duracion && (
              <p className="detalle-informacion">
                <span className="detalle-label">Duración aproximada:</span> {servicio.duracion}
              </p>
            )}
            {servicio.tipoVehiculo && (
              <p className="detalle-informacion">
                <span className="detalle-label">Tipo de Vehículo:</span> {servicio.tipoVehiculo.join(', ')}
              </p>
            )}
            {servicio.marcas && (
              <p className="detalle-informacion">
                <span className="detalle-label">Marcas:</span> {servicio.marcas.join(', ')}
              </p>
            )}
            {servicio.modelos && (
              <p className="detalle-informacion">
                <span className="detalle-label">Modelos:</span> {servicio.modelos.join(', ')}
              </p>
            )}

            <div className="detalle-boton">
              <Link to="/consultaservicios">
                <button className="btn-aceptar w-auto text-sm py-2 px-1">
                  Volver al catálogo
                </button>
              </Link>
            </div>

            <div className="detalle-boton mt-2">
              <Link to="/cotizarprecio">
                <button className="btn-aceptar w-auto text-sm py-2 px-1">
                  Cotizar precios
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
