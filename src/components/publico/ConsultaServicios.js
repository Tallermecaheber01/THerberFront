import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import {
  getAllServices,
  getAllVehicleTypes,
  getAllBrands,
} from '../../api/admin';

function ConsultaServicios() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Breadcrumbs estáticos (fijos)
  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Servicios', link: '/consultaservicios' },
  ];

  // Estados para los datos
  const [services, setServices] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  // Estados para búsqueda y filtros avanzados
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const advancedActive = filters.some((f) => f.type && f.value.trim() !== '');

  // Obtener los servicios de la base de datos
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Obtener los tipos de vehículo de la base de datos
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const data = await getAllVehicleTypes();
        setVehicleTypes(data);
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
      }
    };
    fetchVehicleTypes();
  }, []);

  // Obtener las marcas de la base de datos
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Definir las opciones de filtros usando los datos traídos de la BD
  const filtrosDisponibles = {
    tipoVehiculo: {
      label: 'Tipo de Vehículo',
      options: vehicleTypes.map((tipo) => tipo.nombre),
    },
    marcas: {
      label: 'Marca',
      options: brands.map((marca) => marca.nombre),
    },
  };

  // Función que genera los breadcrumbs dinámicos combinando los estáticos con los filtros activos
  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ''
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: `${filtrosDisponibles[filter.type].label}: ${filter.value}`,
      link: '#', // Link ficticio; se manejará en el callback onCrumbClick
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  // Maneja el clic en un breadcrumb
  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: '', value: '' }]);
      setSearchQuery('');
      navigate(staticBreadcrumbs[index].link);
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters((prevFilters) => prevFilters.slice(0, filterIndex + 1));
    }
  };

  // Actualiza un filtro (tipo o valor)
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    if (field === 'type') newFilters[index].value = ''; // Reinicia el valor si se cambia el tipo
    setFilters(newFilters);
  };

  // Agrega un nuevo filtro (máximo 3)
  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
      filters[filters.length - 1].value.trim() !== ''
    ) {
      setFilters([...filters, { type: '', value: '' }]);
    }
  };

  // Elimina un filtro específico
  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: '', value: '' });
    setFilters(newFilters);
  };

  const appliedFilterTypes = filters.map((filter) => filter.type);

  // Filtrado de servicios según la búsqueda simple o filtros avanzados
  const filteredServices = advancedActive
    ? services.filter((service) =>
        filters.every((filter) => {
          if (!filter.type || !filter.value.trim()) return true;
          const serviceValue = service[filter.type];
          // Si el valor en el servicio es un arreglo, se busca si alguno de sus elementos lo contiene
          if (Array.isArray(serviceValue)) {
            return serviceValue.some((item) =>
              item.toLowerCase().includes(filter.value.toLowerCase())
            );
          } else if (typeof serviceValue === 'string') {
            return serviceValue
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          }
          return false;
        })
      )
    : services.filter((service) => {
        if (searchQuery.trim() === '') return true;
        return (
          service.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

  return (
    <div>
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <section className="services-section">
        <div className="services-container">
          <h2 className="services-title">Catálogo de Servicios</h2>

          <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
            {/* Mostrar búsqueda simple si no hay filtros avanzados */}
            {filters.length === 1 && filters[0].value.trim() === '' && (
              <input
                type="text"
                placeholder="Buscar servicios"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={inputRef}
                className="form-input w-72"
              />
            )}

            {/* Área de filtros avanzados */}
            <div className="flex flex-col items-end space-y-6">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-4 justify-end items-center"
                >
                  <select
                    value={filter.type}
                    onChange={(e) =>
                      handleFilterChange(index, 'type', e.target.value)
                    }
                    className="form-input w-64"
                  >
                    <option value="">Selecciona filtro</option>
                    {Object.keys(filtrosDisponibles)
                      .filter(
                        (key) =>
                          !appliedFilterTypes.includes(key) ||
                          key === filter.type
                      )
                      .map((key) => (
                        <option key={key} value={key}>
                          {filtrosDisponibles[key].label}
                        </option>
                      ))}
                  </select>

                  {filter.type && (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, 'value', e.target.value)
                      }
                      className="form-input w-64"
                    >
                      <option value="">
                        Selecciona {filtrosDisponibles[filter.type].label}
                      </option>
                      {filtrosDisponibles[filter.type].options.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  )}

                  {filters.length > 1 && (
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="textError"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}

              {filters.length < 3 &&
                filters[filters.length - 1].type &&
                filters[filters.length - 1].value.trim() !== '' && (
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handleAddFilter}
                      className="button-yellow w-40"
                    >
                      Agregar Filtro
                    </button>
                  </div>
                )}
            </div>
          </div>

          {/* Listado de servicios filtrados */}
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card card-transition">
                <img
                  src={service.imagen}
                  alt={service.nombre}
                  className="service-card-img"
                />
                <div className="service-card-content">
                  <h3 className="service-card-title">{service.nombre}</h3>
                  <p className="service-card-text">{service.descripcion}</p>
                  <Link to={`/verDetalles/${service.id}`}>
                    <button className="button-yellow mt-4">
                      Ver más detalles
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConsultaServicios;
