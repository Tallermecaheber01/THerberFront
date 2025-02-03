import React from 'react';
import Breadcrumbs from "../Breadcrumbs";

function Home() {

  const breadcrumbPaths = [
    { name: "Catalogo", link: "/consultaservicios" }, // Ruta al login
    { name: "Inicio", link: "/" }, // Ruta al inicio
  ];

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
          <div className="services-grid">
            {/* Servicio 1 */}
            <div className="service-card">
              <img
                src="https://cdn-dljph.nitrocdn.com/PEQqQodxjemeogsAdkpwmiyJxAvbbXbv/assets/images/optimized/rev-4cd2b8f/servitechapp.com/wp-content/uploads/2023/03/MECANICOS-TALLER-980x653.jpg"
                alt="Mantenimiento General"
                className="service-card-img"
              />
              <div className="service-card-content">
                <h3 className="service-card-title">Mantenimiento General</h3>
                <p className="service-card-text">
                  Ofrecemos servicios completos de mantenimiento para que tu vehículo siempre esté en óptimas condiciones.
                </p>
              </div>
            </div>

            {/* Servicio 2 */}
            <div className="service-card">
              <img
                src="https://www.gadsoftware.com/wp-content/uploads/2024/01/sistemas-de-diagnostico-de-vehiculos-768x507.jpg"
                alt="Diagnóstico Electrónico"
                className="service-card-img"
              />
              <div className="service-card-content">
                <h3 className="service-card-title">Diagnóstico Electrónico</h3>
                <p className="service-card-text">
                  Contamos con equipos de última tecnología para realizar diagnósticos precisos y eficientes.
                </p>
              </div>
            </div>

            {/* Servicio 3 */}
            <div className="service-card">
              <img
                src="https://aprende.com/wp-content/uploads/2024/02/reparacion-de-motores-diesel.webp"
                alt="Reparación de Motor"
                className="service-card-img"
              />
              <div className="service-card-content">
                <h3 className="service-card-title">Reparación de Motor</h3>
                <p className="service-card-text">
                  Realizamos reparaciones completas y parciales de motores con garantías de calidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
