import React, { useState, useEffect } from 'react';
import { getAllPolices } from '../../api/admin';
import Breadcrumbs from '../Breadcrumbs';

function PoliticaDePrivacidad() {
  const [activePolicy, setActivePolicy] = useState(null);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Politicas De Privacidad', link: '/PoliticaDePrivacidad' },
  ];

  useEffect(() => {
    const fetchActivePolicy = async () => {
      try {
        const policies = await getAllPolices();
        const active = policies.find(policy => policy.estado === "Activo");
        setActivePolicy(active);
      } catch (error) {
        console.error("Error al traer la política activa:", error);
      }
    };
    fetchActivePolicy();
  }, []);

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-12">
        {activePolicy ? (
          <div>
            {/* Si la política activa tiene título, se puede mostrar, de lo contrario se muestra "Política de Privacidad" */}
            <h1 className="detalle-title text-center text-4xl font-extrabold mb-8">
              {activePolicy.titulo || "Política de Privacidad"}
            </h1>
            <p className="text-white dark:text-gray-300 text-lg">
              {activePolicy.descripcion}
            </p>
          </div>
        ) : (
          <p className="text-white dark:text-gray-300 text-lg text-center">
            No hay política activa en este momento.
          </p>
        )}
      </div>
    </div>
  );
}

export default PoliticaDePrivacidad;
