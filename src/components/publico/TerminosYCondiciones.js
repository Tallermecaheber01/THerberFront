import React, { useState, useEffect } from 'react';
import { getAllTerms } from '../../api/admin';
import Breadcrumbs from '../Breadcrumbs';

export default function TerminosYCondiciones() {
  const [termino, setTermino] = useState(null);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Términos y Condiciones', link: '/terminos-y-condiciones' },
  ];

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const terms = await getAllTerms();
        if (terms && terms.length > 0) {
          setTermino(terms[0]);
        }
      } catch (error) {
        console.error('Error al traer los términos y condiciones:', error);
      }
    };
    fetchTerminos();
  }, []);

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-12">
        {termino ? (
          <div className="max-w-6xl mx-auto">
            <h1 className="detalle-title text-4xl font-extrabold mb-8 text-center">
              Términos y Condiciones
            </h1>
            <div className="text-black dark:text-gray-300 text-lg whitespace-pre-line text-left">
              {termino.info}
            </div>
          </div>
        ) : (
          <p className="max-w-6xl mx-auto text-lg text-gray-700 dark:text-gray-300 text-left">
            Cargando términos y condiciones...
          </p>
        )}
      </div>
    </div>
  );
}
