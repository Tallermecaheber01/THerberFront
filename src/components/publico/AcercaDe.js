import React from 'react';

function AcercaDe() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Acerca de Nosotros</h1>

      {/* Sección de descripción */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">¿Quiénes somos?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Somos un taller automotriz comprometido con brindar el mejor servicio de reparación y mantenimiento para tu vehículo.
          Con años de experiencia en el sector, nuestro equipo altamente capacitado se asegura de ofrecer soluciones rápidas, efectivas y confiables.
        </p>
      </section>

      {/* Sección de Misión */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Misión</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Nuestra misión es ofrecer servicios de reparación automotriz de alta calidad, basados en la honestidad, la eficiencia y la atención al detalle.
          Buscamos garantizar la satisfacción de nuestros clientes a través de soluciones personalizadas y accesibles.
        </p>
      </section>

      {/* Sección de Visión */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Visión</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Ser reconocidos como el taller automotriz líder en la región, destacado por su compromiso con la calidad, el servicio al cliente y la innovación en la tecnología automotriz.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Nuestros Valores</h2>
        <ul className="list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
          <li>Compromiso con la calidad</li>
          <li>Responsabilidad y honestidad</li>
          <li>Trabajo en equipo</li>
          <li>Innovación constante</li>
          <li>Atención al cliente excepcional</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contacto</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Si necesitas más información o deseas programar una cita para tu vehículo, no dudes en ponerte en contacto con nosotros.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <strong>Correo:</strong> tallermecanicoheber@gmail.com
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <strong>Teléfono:</strong> +52 7712342721
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <strong>Dirección:</strong> Calle Ficticia 123, Ciudad, Estado.
        </p>
      </section>
    </div>
  );
}

export default AcercaDe;
