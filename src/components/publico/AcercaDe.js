import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { getAllCorporateImages } from '../../api/admin';

function AcercaDe() {
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Acerca De', link: '/AcercaDe' },
  ];

  const [corporateData, setCorporateData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorporateData = async () => {
      try {
        const data = await getAllCorporateImages();
        console.log("Datos obtenidos:", data);
        setCorporateData(data || []);
      } catch (error) {
        console.error("Error al obtener los datos corporativos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorporateData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="container mx-auto px-4 py-8">
        {corporateData.length > 0 ? (
          corporateData.map(item => {
            const descripcion = item.descripcion || "";
            return (
              <section key={item.id} className="mb-8">
                <h2 className="text-2xl font-bold text-black dark:text-yellow-300 text-center mb-4 text-center">{item.titulo}</h2>
                {descripcion.includes('\n') ? (
                  <ul className="list-disc list-inside text-black dark:text-gray-300 text-lg mb-4 text-left">
                    {descripcion.split('\n').map((line, index) => (
                      <li key={index}>{line.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-black dark:text-gray-300 text-lg mb-4 text-center">
                    {descripcion}
                  </p>
                )}
              </section>
            );
          })
        ) : (
          <p className="text-black">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default AcercaDe;
