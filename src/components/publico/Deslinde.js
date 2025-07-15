import React, { useState, useEffect } from 'react';
import { getAllDemarcations } from '../../api/admin';
import Breadcrumbs from '../Breadcrumbs';

export default function DeslindeLegal() {
  const [deslindeLegal, setDeslindeLegal] = useState(null);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Deslinde Legal', link: '/deslinde-legal' },
  ];

  useEffect(() => {
    const fetchDeslinde = async () => {
      try {
        const demarcations = await getAllDemarcations();
        if (demarcations && demarcations.length > 0) {
          setDeslindeLegal(demarcations[0]);
        }
      } catch (error) {
        console.error('Error al traer el deslinde legal:', error);
      }
    };
    fetchDeslinde();
  }, []);

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="container mx-auto px-4 py-12">
        {deslindeLegal ? (
          <div className="max-w-6xl mx-auto">
            <h1 className="detalle-title text-4xl font-extrabold mb-8 text-center">
              Deslinde Legal
            </h1>
            <div className="text-black dark:text-gray-300 text-lg whitespace-pre-line text-left">
              {deslindeLegal.info}
            </div>
          </div>
        ) : (
          <p className="max-w-6xl mx-auto text-lg text-gray-700 dark:text-gray-300 text-left">
            Cargando deslinde legal...
          </p>
        )}
      </div>
    </div>
  );
}

