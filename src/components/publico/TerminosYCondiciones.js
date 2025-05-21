import React from 'react';
import Breadcrumbs from '../Breadcrumbs';

function TerminosYCondiciones() {
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Terminos Y Condiciones', link: '/TerminosYCondiciones' },
  ];
  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-12">

        <h1 className="detalle-title text-center text-4xl font-extrabold mb-8">
          Términos y Condiciones
        </h1>


        <section className="mb-12">
          <h2 className="detalle-title">Aceptación de los Términos</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            Al acceder y utilizar nuestros servicios, aceptas cumplir con estos
            Términos y Condiciones. Si no estás de acuerdo con alguno de estos
            términos, por favor, no utilices nuestros servicios.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="detalle-title">Modificaciones a los Términos</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            Nos reservamos el derecho de modificar o actualizar estos Términos y
            Condiciones en cualquier momento. Los cambios serán publicados en
            esta página y entrarán en vigor inmediatamente después de su
            publicación.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="detalle-title">Uso del Servicio</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            El uso de nuestros servicios se rige por las leyes aplicables. Te
            comprometes a utilizar nuestros servicios de manera lícita y a no
            incurrir en actividades que puedan dañar, interferir o interrumpir
            el funcionamiento del sitio o de los servicios.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="detalle-title">Propiedad Intelectual</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            Todos los contenidos, marcas, logos, y derechos de autor presentes
            en el sitio son propiedad exclusiva de [Nombre de la Empresa] o de
            terceros que han autorizado su uso. Queda prohibida su reproducción
            total o parcial sin el consentimiento previo y por escrito.
          </p>
        </section>


        <section className="mb-12">
          <h2 className="detalle-title">Limitación de Responsabilidad</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            [Nombre de la Empresa] no será responsable por daños directos,
            indirectos, incidentales, especiales o consecuentes derivados del
            uso o la imposibilidad de uso de nuestros servicios.
          </p>
        </section>


        <section className="mb-12">
          <h2 className="detalle-title">Legislación Aplicable</h2>
          <p className="text-black dark:text-gray-300 text-lg">
            Estos Términos y Condiciones se regirán e interpretarán de acuerdo
            con las leyes vigentes en [País o Estado], sin perjuicio de las
            normas de conflicto de leyes.
          </p>
        </section>

        <section>
          <h2 className="detalle-title">Contacto</h2>
          <p className="text-black dark:text-gray-300 text-lg mb-4">
            Si tienes alguna duda o comentario respecto a estos Términos y
            Condiciones, por favor contáctanos a:
          </p>
          <p className="text-black dark:text-gray-300 text-lg">
            <strong>Correo:</strong> tallermecanicoheber@gmail.com
          </p>
          <p className="text-black dark:text-gray-300 text-lg">
            <strong>Teléfono:</strong> +52 7712342721
          </p>
        </section>
      </div>
    </div>
  );
}

export default TerminosYCondiciones;
