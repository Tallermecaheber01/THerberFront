import React, { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';

function CitasCanceladas() {
  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Citas Canceladas', link: '/citascanceladas' },
  ];

  const [citas] = useState([
    {
      id: 1,
      cliente: 'Juan Pérez',
      servicio: 'Cambio de aceite',
      fecha: '2025-01-05',
      hora: '10:00',
      canceladoPor: 'empleado',
      empleadoCancelador: 'Pablo',
      mensajeCancelacion: 'El cliente canceló por enfermedad.',
      fechaCancelacion: '2025-01-04',
    },
    {
      id: 2,
      cliente: 'María Gómez',
      servicio: 'Revisión general',
      fecha: '2025-01-06',
      hora: '12:00',
      canceladoPor: 'cliente',
      mensajeCancelacion: 'Ya no necesito el servicio.',
      fechaCancelacion: '2025-01-05',
    },
    {
      id: 3,
      cliente: 'Carlos López',
      servicio: 'Cambio de llantas',
      fecha: '2025-01-05',
      hora: '14:00',
      canceladoPor: 'empleado',
      empleadoCancelador: 'Pedro',
      mensajeCancelacion: 'Se encontró una falla en el vehículo.',
      fechaCancelacion: '2025-01-05',
    },
  ]);

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

  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      searchQuery === '' ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === '' || filter.value.trim() === '') return true;
      if (filter.type === 'canceladoPor') {
        return normalizeStr(cita.canceladoPor) === normalizeStr(filter.value);
      } else if (filter.type === 'nombreCancelador') {
        return (
          cita.empleadoCancelador &&
          normalizeStr(cita.empleadoCancelador).includes(
            normalizeStr(filter.value)
          )
        );
      } else {
        const fieldValue = cita[filter.type];
        if (!fieldValue) return false;
        return normalizeStr(String(fieldValue)).includes(
          normalizeStr(filter.value)
        );
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
                  <div
                    key={cita.id}
                    className="reparacion-card card-transition"
                  >
                    <div className="mb-2">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{cita.cliente}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Servicio: </span>
                      <span className="detalle-costo">{cita.servicio}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Fecha de la cita: </span>
                      <span className="detalle-costo">{cita.fecha}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Cancelado por: </span>
                      {cita.canceladoPor === 'cliente' ? (
                        <span className="detalle-costo">Cliente</span>
                      ) : (
                        <>
                          <span className="detalle-costo">Empleado </span>
                          <span className="detalle-costo">
                            {cita.empleadoCancelador}
                          </span>
                        </>
                      )}
                    </div>
                    {cita.mensajeCancelacion && (
                      <div className="mb-2">
                        <span className="detalle-label">
                          Mensaje de cancelación:{' '}
                        </span>
                        <span className="detalle-costo">
                          {cita.mensajeCancelacion}
                        </span>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="detalle-label">
                        Fecha de cancelación:{' '}
                      </span>
                      <span className="detalle-costo">
                        {cita.fechaCancelacion}
                      </span>
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
