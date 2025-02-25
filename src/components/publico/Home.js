import React, { useState, useEffect } from 'react';
import Breadcrumbs from "../Breadcrumbs";
import { getAllServices } from '../../api/admin';

function Home() {
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const breadcrumbPaths = [
    { name: "Catalogo", link: "/consultaservicios" },
    { name: "Inicio", link: "/" },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Función para avanzar al siguiente grupo de 3 tarjetas
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (services.length <= 3) return 0;
      if (prevIndex >= services.length - 3) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  // Función para retroceder al grupo anterior de 3 tarjetas
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (services.length <= 3) return 0;
      if (prevIndex === 0) {
        return services.length - 3;
      }
      return prevIndex - 1;
    });
  };

  // Auto slide cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (services.length <= 3) return 0;
        if (prevIndex >= services.length - 3) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [services]);

  return (
    <div>
      {/* Sección Principal */}
      <section className="home-banner">
        <img
          src="https://cdn-3.expansion.mx/dims4/default/ddae30c/2147483647/strip/true/crop/1254x837+0+0/resize/1800x1201!/format/webp/quality/80/?url=https%3A%2F%2Fcdn-3.expansion.mx%2Fe1%2F91%2F6b6f2f0d4630a6a378a16469a815%2Finflacion-mexico-hace-mas-caro-tener-carro.jpeg"
          alt="Fondo del Taller"
          className="home-banner-img"
        />
        <div className="home-banner-overlay">
          <h1 className="home-banner-title">Bienvenido a Taller Automotriz Heber</h1>
        </div>
      </section>

      <Breadcrumbs paths={breadcrumbPaths} />

      {/* Sección de Servicios */}
      <section className="services-section">
        <div className="services-container">
          <h2 className="services-title">Nuestros Servicios</h2>
          {services.length > 0 ? (
            <div className="carousel" style={{ position: 'relative' }}>
              {/* Botón Anterior */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 -translate-y-1/2 text-yellow-600 text-4xl hover:scale-125 transition-transform duration-300"
                style={{
                  left: '-1rem',
                }}
              >
                &#8249;
              </button>

              {/* Contenedor de tarjetas */}
              <div
                className="carousel-container"
                style={{
                  display: 'flex',
                  overflow: 'hidden',
                  gap: '1rem',
                }}
              >
                {services.slice(currentIndex, currentIndex + 3).map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    style={{
                      flex: '0 0 calc(33.33% - 1rem)',
                    }}
                  >
                    <img
                      src={service.imagen}
                      alt={service.nombre}
                      className="service-card-img"
                    />
                    <div className="service-card-content">
                      <h3 className="service-card-title">{service.nombre}</h3>
                      <p className="service-card-text">{service.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-yellow-600 text-4xl hover:scale-125 transition-transform duration-300"
              >
                &#8250;
              </button>
            </div>
          ) : (
            <p className="no-resultados">No hay servicios disponibles.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
