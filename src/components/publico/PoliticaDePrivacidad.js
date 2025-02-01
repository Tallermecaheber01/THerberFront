import React from 'react';

function PoliticaDePrivacidad() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Política de Privacidad</h1>

      {/* Sección de Introducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Introducción</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          En [Nombre de la Empresa], valoramos y respetamos la privacidad de nuestros usuarios. Esta política de privacidad describe cómo recopilamos, usamos y protegemos la información personal que nos proporcionas.
        </p>
      </section>

      {/* Sección de Información que Recopilamos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Información que Recopilamos</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Recopilamos información personal cuando usas nuestros servicios, como tu nombre, dirección de correo electrónico, dirección IP y detalles de pago, entre otros.
        </p>
      </section>

      {/* Sección de Uso de la Información */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Uso de la Información</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Usamos la información que recopilamos para mejorar nuestros servicios, procesar pagos, mantenerte informado sobre actualizaciones y ofrecerte una experiencia personalizada.
        </p>
      </section>

      {/* Sección de Protección de la Información */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Protección de la Información</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Implementamos medidas de seguridad para proteger la información personal que nos proporcionas. Sin embargo, no podemos garantizar la seguridad total de la información en línea.
        </p>
      </section>

      {/* Sección de Compartir la Información */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">¿Compartimos tu Información?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No compartimos ni vendemos tu información personal a terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley o cuando esté relacionado con la operación de nuestros servicios.
        </p>
      </section>

      {/* Sección de Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Uso de Cookies</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Utilizamos cookies para mejorar la experiencia del usuario, analizar el tráfico del sitio y personalizar los contenidos que ofrecemos. Puedes configurar tu navegador para bloquear las cookies si lo prefieres.
        </p>
      </section>

      {/* Sección de Derechos del Usuario */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Derechos del Usuario</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Tienes el derecho de acceder, corregir o eliminar tu información personal en cualquier momento. Si deseas ejercer estos derechos, por favor contacta con nosotros a través de la información de contacto proporcionada al final de esta política.
        </p>
      </section>

      {/* Sección de Cambios a esta Política */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Cambios a esta Política</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Cualquier cambio será notificado en esta página.
        </p>
      </section>

      {/* Sección de Información de Contacto */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contacto</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Si tienes preguntas o inquietudes sobre esta política de privacidad, por favor contáctanos a:
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <strong>Correo:</strong> tallermecanicoheber@gmail.com
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <strong>Teléfono:</strong> +52 7712342721
        </p>
      </section>
    </div>
  );
}

export default PoliticaDePrivacidad;
