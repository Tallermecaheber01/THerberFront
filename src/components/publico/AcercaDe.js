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
            // Aseguramos que descripcion siempre sea una cadena
            const descripcion = item.descripcion || "";
            return (
              <section key={item.id} className="mb-8">
                <h2 className="form-title text-center">{item.titulo}</h2>
                {descripcion.includes('\n') ? (
                  // Si hay saltos de línea, renderizamos una lista con items alineados a la izquierda
                  <ul className="list-disc list-inside text-white dark:text-gray-300 text-lg mb-4 text-left">
                    {descripcion.split('\n').map((line, index) => (
                      <li key={index}>{line.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  // Si no hay saltos de línea, se muestra el párrafo centrado
                  <p className="text-white dark:text-gray-300 text-lg mb-4 text-center">
                    {descripcion}
                  </p>
                )}
              </section>
            );
          })
        ) : (
          <p className="text-white">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
}

export default AcercaDe;
