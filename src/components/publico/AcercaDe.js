import React from 'react';
import Breadcrumbs from "../Breadcrumbs";

function AcercaDe() {
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Acerca De", link: "/AcercaDe" },
  ];
  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="detalle-title">Misión</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Brindar servicios automotrices confiables e innovadores, respaldados por soluciones tecnológicas que faciliten la gestión de reparaciones, el acceso a información y la comunicación transparente con los clientes. Nuestro compromiso es optimizar cada aspecto de la experiencia automotriz, asegurando calidad, eficiencia y confianza en cada interacción.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="detalle-title">Visión</h2>
          <p className="text-white dark:text-gray-300 text-lg">
            Convertirnos en el referente regional en servicios automotrices, reconocidos por nuestra excelencia en atención al cliente, implementación de tecnologías de vanguardia y capacidad para adaptarnos a las necesidades cambiantes de nuestros clientes. Aspiramos a ser el taller más confiable, eficiente e innovador, liderando el mercado en gestión digital y satisfacción del cliente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="detalle-title">Valores</h2>
          <ul className="list-disc ml-6 text-white dark:text-gray-300 text-lg">
            <li>
              <strong>Calidad:</strong> Nos enfocamos en garantizar un servicio preciso, seguro y de alto estándar, cuidando cada detalle en las reparaciones y mantenimientos.
            </li>
            <li>
              <strong>Transparencia:</strong> Ofrecemos a nuestros clientes acceso directo y claro a la información sobre el estado y el historial de sus vehículos.
            </li>
            <li>
              <strong>Compromiso:</strong> Mantenemos un enfoque orientado al cliente, asegurando que sus necesidades sean atendidas de manera oportuna y profesional.
            </li>
            <li>
              <strong>Colaboración:</strong> Fomentamos un ambiente de trabajo en equipo entre nuestro personal y los clientes, mejorando la comunicación y los resultados.
            </li>
          </ul>
        </section>


        <section className="mb-8">
          <h2 className="detalle-title">Objetivo</h2>
          <p className="text-white dark:text-gray-300 text-lg mb-4">
            Brindar servicios automotrices de alta calidad, mejorando continuamente los procesos internos y la atención al cliente, con el objetivo de consolidarse como el taller mecánico líder en la región, reconocido por su confiabilidad, eficiencia y compromiso con la satisfacción del cliente.
          </p>
          <h3 className="form-title">Objetivos Específicos:</h3>
          <ol className="list-decimal ml-6 text-white dark:text-gray-300 text-lg">
            <li>
              <strong>Optimizar los procesos operativos:</strong> Mejorar la gestión de reparaciones y mantenimientos para garantizar tiempos de respuesta más rápidos y una mayor precisión en los servicios realizados.
            </li>
            <li>
              <strong>Fortalecer la relación con los clientes:</strong> Implementar estrategias que aseguren una comunicación efectiva, personalizada y transparente, incrementando la confianza y fidelidad de los clientes.
            </li>
            <li>
              <strong>Garantizar la calidad del servicio:</strong> Desarrollar procedimientos estandarizados que aseguren que cada reparación o mantenimiento cumpla con los más altos estándares del sector automotriz.
            </li>
            <li>
              <strong>Ampliar la cartera de servicios:</strong> Diversificar los servicios ofrecidos para cubrir más necesidades del cliente, desde mantenimientos preventivos hasta diagnósticos especializados y soluciones avanzadas para vehículos modernos.
            </li>
            <li>
              <strong>Consolidar la marca:</strong> Posicionar a "Servicio Automotriz Heber" como una empresa confiable y líder en la región, mediante estrategias que refuercen su reputación y presencia en el mercado.
            </li>
            <li>
              <strong>Garantizar la seguridad en las operaciones:</strong> Asegurar que todas las actividades y procesos cumplan con las normativas y estándares vigentes, protegiendo tanto a los clientes como al personal del taller.
            </li>
            <li>
              <strong>Fortalecer la gestión financiera:</strong> Monitorear constantemente los ingresos, gastos y rentabilidad para garantizar el crecimiento sostenido del negocio y la optimización de recursos.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default AcercaDe;
