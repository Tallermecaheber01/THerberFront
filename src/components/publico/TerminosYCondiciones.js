import React from 'react';

function TerminosYCondiciones() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Términos y Condiciones</h1>

      {/* Sección de Introducción */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Introducción</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de utilizar este sitio web.
        </p>
      </section>

      {/* Sección de Aceptación de los Términos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Aceptación de los Términos</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones y con todas las leyes y regulaciones locales que rigen su uso.
        </p>
      </section>

      {/* Sección de Uso del Servicio */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Uso del Servicio</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          El usuario se compromete a utilizar los servicios del sitio web solo para fines legales y de acuerdo con las condiciones establecidas en estos términos.
        </p>
      </section>

      {/* Sección de Limitación de Responsabilidad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Limitación de Responsabilidad</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          [Nombre de la empresa] no será responsable de los daños o perjuicios directos, indirectos, incidentales, especiales o consecuentes que puedan resultar del uso de nuestro sitio web.
        </p>
      </section>

      {/* Sección de Propiedad Intelectual */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Propiedad Intelectual</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Todos los derechos de propiedad intelectual, incluyendo marcas registradas, derechos de autor y patentes, son propiedad de [Nombre de la empresa] o de sus respectivos propietarios.
        </p>
      </section>

      {/* Sección de Cambios a los Términos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Cambios a los Términos</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Cualquier cambio será publicado en esta página, y se considerará aceptado por el usuario a partir del momento en que acceda nuevamente al sitio.
        </p>
      </section>

      {/* Sección de Terminación de Servicio */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Terminación del Servicio</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          [Nombre de la empresa] se reserva el derecho de suspender o terminar el acceso al servicio en cualquier momento, sin previo aviso, si se considera que el usuario ha violado los términos establecidos.
        </p>
      </section>

      {/* Sección de Información de Contacto */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contacto</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Si tienes preguntas sobre estos términos y condiciones, por favor contáctanos a:
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

export default TerminosYCondiciones;
