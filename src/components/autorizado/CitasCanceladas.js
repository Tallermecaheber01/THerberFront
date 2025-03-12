import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { getAppointmentsCancelled } from '../../api/employ';

function CitasCanceladas() {
  const [appointmentCancelled, setAppointmentCancelled] = useState([]);
  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Citas Canceladas', link: '/citascanceladas' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentCancelledData = await getAppointmentsCancelled();
        console.log("Citas canceladas:", appointmentCancelledData);
        setAppointmentCancelled(appointmentCancelledData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  


  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeStr = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type.trim() !== '' && filter.value.trim() !== ''
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name:
        filter.type === 'nombreCancelador'
          ? 'Nombre del cancelador: ' + filter.value
          : filter.type.charAt(0).toUpperCase() +
          filter.type.slice(1) +
          ': ' +
          filter.value,
      link: '#',
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  const dynamicBreadcrumbs = getDynamicBreadcrumbs();

  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: '', value: '' }]);
      setSearchQuery('');
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type.trim() !== '' &&
      filters[filters.length - 1].value.trim() !== ''
    ) {
      setFilters([...filters, { type: '', value: '' }]);
    }
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: '', value: '' });
    setFilters(newFilters);
  };

  const filteredCitas = appointmentCancelled.filter((cita) => {
    const matchesSearch =
      searchQuery === '' ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );

    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === '' || filter.value.trim() === '') return true;

      // Filtrar por canceladoPor
      if (filter.type === 'canceladoPor') {
        return cita.cancelaciones.some(
          (cancelacion) =>
            normalizeStr(cancelacion.canceladoPor).includes(normalizeStr(filter.value))
        );
      }
      // Filtrar por nombreCancelador (Empleado o Cliente)
      else if (filter.type === 'nombreCancelador') {
        return cita.cancelaciones.some(
          (cancelacion) =>
            normalizeStr(cancelacion.canceladoPor).includes(normalizeStr(filter.value))
        );
      }
      // Filtrar por nombreCliente
      else if (filter.type === 'cliente') {
        const normalizedCliente = normalizeStr(cita.nombreCliente || ''); // Si no hay nombreCliente, se reemplaza por una cadena vacía
        const normalizedFilter = normalizeStr(filter.value || ''); // Si no hay valor en el filtro, se reemplaza por una cadena vacía

        // Verificamos si el valor del filtro no está vacío y si existe nombreCliente
        if (normalizedFilter === '') return true; // Si el filtro está vacío, no aplicamos el filtro
        if (normalizedCliente === '') return false; // Si no hay nombreCliente, no lo incluimos

        // Si los valores son válidos, verificamos si el nombreCliente contiene el valor del filtro
        return normalizedCliente.includes(normalizedFilter);
      }

      // Filtrar por servicio
      else if (filter.type === 'servicio') {
        // Obtener todos los servicios de la cita
        const servicios = cita.services || [];
        const normalizedFilter = normalizeStr(filter.value || ''); // Normalizar el valor del filtro

        // Recorrer el arreglo de servicios y verificar si alguno cumple con el filtro
        const match = servicios.some(servicio =>
          normalizeStr(servicio.servicio).includes(normalizedFilter) // Compara cada servicio con el filtro
        );

        return normalizedFilter === '' || match; // Si el filtro está vacío, no aplicamos el filtro, si hay coincidencia, lo mostramos
      }


      // Para los demás filtros (campo general)
      else {
        const fieldValue = cita[filter.type];
        if (!fieldValue) return false; // Si no existe el campo, lo excluimos
        return normalizeStr(String(fieldValue)).includes(normalizeStr(filter.value));
      }
    });

    return matchesSearch && matchesAdvanced;
  });



  const baseFilterOptions = ['cliente', 'servicio', 'canceladoPor'];
  const hasCanceladoPor = filters.some((f) => f.type === 'canceladoPor');
  let filterOptions = [...baseFilterOptions];
  if (hasCanceladoPor && !filters.some((f) => f.type === 'nombreCancelador')) {
    filterOptions.push('nombreCancelador');
  }

  return (
    <div>
      <Breadcrumbs
        paths={dynamicBreadcrumbs}
        onCrumbClick={handleBreadcrumbClick}
      />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Consultar Citas Canceladas</h1>
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {filters.length === 1 &&
              filters[0].type.trim() === '' &&
              filters[0].value.trim() === '' && (
                <input
                  type="text"
                  placeholder="Buscar citas canceladas"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-72 text-right"
                />
              )}
            <div className="flex flex-col gap-4 items-end">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={filter.type}
                    onChange={(e) =>
                      handleFilterChange(index, 'type', e.target.value)
                    }
                    className="form-input w-64 text-right"
                  >
                    <option value="">Selecciona tipo de filtro</option>
                    {filterOptions
                      .filter((type) => {
                        if (filter.type === type) return true;
                        return !filters.some(
                          (f, i) => i !== index && f.type === type
                        );
                      })
                      .map((type) => (
                        <option key={type} value={type}>
                          {type === 'nombreCancelador'
                            ? 'Nombre del cancelador'
                            : type === 'cliente'
                              ? 'Nombre del Cliente'
                              : type === 'servicio'
                                ? 'Servicio'
                                : type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>
                  {filter.type === 'canceladoPor' ? (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, 'value', e.target.value)
                      }
                      className="form-input w-64 text-right"
                    >
                      <option value="">Selecciona</option>
                      <option value="empleado">Empleado</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Busqueda"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, 'value', e.target.value)
                      }
                      className="form-input w-64 text-right"
                    />
                  )}
                  {filters.length > 1 && (
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="textError"
                      type="button"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              {filters.length < 3 &&
                filters[filters.length - 1].type.trim() !== '' &&
                filters[filters.length - 1].value.trim() !== '' && (
                  <button
                    onClick={handleAddFilter}
                    className="button-yellow w-40"
                    type="button"
                  >
                    Agregar Filtro
                  </button>
                )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="cita-title text-center">Citas Canceladas</h2>
            {filteredCitas.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCitas.map((cita) => (
                  <div key={cita.cita_id} className="reparacion-card card-transition">
                    <div className="mb-2">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{cita.nombreCliente}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Estado de la cita: </span>
                      <span className="detalle-costo">{cita.estadoCita}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Fecha de la cita: </span>
                      <span className="detalle-costo">{new Date(cita.fecha).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>

                    {/* Mostrar detalles de las cancelaciones */}
                    {cita.cancelaciones.map((cancelacion, index) => (
                      <div key={index}>
                        <div className="mb-2">
                          <span className="detalle-label">Cancelado por: </span>
                          <span className="detalle-costo">{cancelacion.canceladoPor}</span>
                        </div>
                        <div className="mb-2">
                          <span className="detalle-label">Motivo: </span>
                          <span className="detalle-costo">{cancelacion.motivo}</span>
                        </div>
                        <div className="mb-2">
                          <span className="detalle-label">Fecha de cancelación: </span>
                          <span className="detalle-costo">{new Date(cancelacion.canceladoEn).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}

                    {/* Mostrar los servicios */}
                    <div className="mb-2">
                      <span className="detalle-label">Servicios:</span>
                      <div>
                        {cita.services.map((service) => (
                          <div key={service.servicio_id} className="mb-2">
                            <span className="detalle-costo">{service.servicio}</span>
                            <span className="detalle-costo">{`Costo: ${service.costoServicio}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia">
                No se encontraron citas canceladas con los filtros aplicados.
              </p>
            )}

          </div>
        </form>
      </div>
    </div>
  );
}

export default CitasCanceladas;
