import React from 'react';
import Breadcrumbs from "../Breadcrumbs";

function PoliticaDePrivacidad() {
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Politicas De Privacidad", link: "/PoliticaDePrivacidad" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-12">
        {/* Título principal */}
        <h1 className="detalle-title text-center text-4xl font-extrabold mb-8">
          Política de Privacidad
        </h1>

        {/* Sección de Introducción */}
        <section className="mb-12">
          <h2 className="detalle-title">Introducción</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            En [Nombre de la Empresa], valoramos y respetamos la privacidad de nuestros usuarios. Esta política de privacidad describe cómo recopilamos, usamos y protegemos la información personal que nos proporcionas.
          </p>
        </section>

        {/* Sección de Información que Recopilamos */}
        <section className="mb-12">
          <h2 className="detalle-title">Información que Recopilamos</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Recopilamos información personal cuando usas nuestros servicios, como tu nombre, dirección de correo electrónico, dirección IP y detalles de pago, entre otros.
          </p>
        </section>

        {/* Sección de Uso de la Información */}
        <section className="mb-12">
          <h2 className="detalle-title">Uso de la Información</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Usamos la información que recopilamos para mejorar nuestros servicios, procesar pagos, mantenerte informado sobre actualizaciones y ofrecerte una experiencia personalizada.
          </p>
        </section>

        {/* Sección de Protección de la Información */}
        <section className="mb-12">
          <h2 className="detalle-title">Protección de la Información</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Implementamos medidas de seguridad para proteger la información personal que nos proporcionas. Sin embargo, no podemos garantizar la seguridad total de la información en línea.
          </p>
        </section>

        {/* Sección de Compartir la Información */}
        <section className="mb-12">
          <h2 className="detalle-title">¿Compartimos tu Información?</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            No compartimos ni vendemos tu información personal a terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley o cuando esté relacionado con la operación de nuestros servicios.
          </p>
        </section>

        {/* Sección de Cookies */}
        <section className="mb-12">
          <h2 className="detalle-title">Uso de Cookies</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Utilizamos cookies para mejorar la experiencia del usuario, analizar el tráfico del sitio y personalizar los contenidos que ofrecemos. Puedes configurar tu navegador para bloquear las cookies si lo prefieres.
          </p>
        </section>

        {/* Sección de Derechos del Usuario */}
        <section className="mb-12">
          <h2 className="detalle-title">Derechos del Usuario</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Tienes el derecho de acceder, corregir o eliminar tu información personal en cualquier momento. Si deseas ejercer estos derechos, por favor contáctanos a través de la información de contacto proporcionada al final de esta política.
          </p>
        </section>

        {/* Sección de Cambios a esta Política */}
        <section className="mb-12">
          <h2 className="detalle-title">Cambios a esta Política</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Cualquier cambio será notificado en esta página.
          </p>
        </section>

        {/* Sección de Información de Contacto */}
        <section>
          <h2 className="detalle-title">Contacto</h2>
          <p className="text-white dark:text-gray-300 text-lg mb-4">
            Si tienes preguntas o inquietudes sobre esta política de privacidad, por favor contáctanos a:
          </p>
          <p className="text-white dark:text-gray-300 text-lg">
            <strong>Correo:</strong> tallermecanicoheber@gmail.com
          </p>
          <p className="text-white dark:text-gray-300 text-lg">
            <strong>Teléfono:</strong> +52 7712342721
          </p>
        </section>
      </div>
      </div>
  );
}

export default PoliticaDePrivacidad;
