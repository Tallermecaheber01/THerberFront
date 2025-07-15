import React, { useState, useEffect } from 'react';
import { getAllSecurityPolicies } from '../../api/admin';
import Breadcrumbs from '../Breadcrumbs';

export default function PoliticaSeguridad() {
  const [policy, setPolicy] = useState(null);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Políticas de Seguridad', link: '/politica-seguridad' },
  ];

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policies = await getAllSecurityPolicies();
        if (policies && policies.length > 0) {
          setPolicy(policies[0]);
        }
      } catch (error) {
        console.error('Error al traer la política de seguridad:', error);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-12">
        {policy ? (
          <div className="max-w-6xl mx-auto">
            <h1 className="detalle-title text-4xl font-extrabold mb-8 text-center">
              Política de Seguridad
            </h1>
            <div className="text-black dark:text-gray-300 text-lg whitespace-pre-line text-left">
              {policy.info}
            </div>
          </div>
        ) : (
          <p className="max-w-6xl mx-auto text-lg text-gray-700 dark:text-gray-300 text-left">
            Cargando política de seguridad...
          </p>
        )}
      </div>
    </div>
  );
}
