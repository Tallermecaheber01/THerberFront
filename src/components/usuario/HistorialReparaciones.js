import React, { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';

function HistorialReparaciones() {
  // estado de búsqueda simple y filtros avanzados
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([{ type: '', value: '' }]);

  // datos de ejemplo
  const [reparaciones] = useState([
    { id: 'V123', marca: 'BMW', modelo: 'X3', servicio: 'Cambio de Aceite', fechaHora: '2024-12-01T10:30', trabajador: 'Luis Gómez', comentario: 'Filtro reemplazado correctamente', costo: 120 },
    { id: 'V456', marca: 'Ford', modelo: 'Focus', servicio: 'Revisión General', fechaHora: '2024-11-15T08:00', trabajador: 'María Pérez', comentario: 'Ajuste de frenos y aceite', costo: 200 },
    { id: 'V789', marca: 'BMW', modelo: 'M3', servicio: 'Alineación de Ruedas', fechaHora: '2024-10-20T14:45', trabajador: 'Carlos Ruiz', comentario: 'Balanceo final ok, Balanceo final ok Balanceo final ok. Balanceo final ok', costo: 150 },
  ]);

  const availableFilterTypes = ['marca', 'modelo', 'servicio', 'trabajador'];

  // handlers
  const handleFilterChange = (i, field, val) => {
    const newF = [...filters];
    newF[i] = { ...newF[i], [field]: val };
    if (field === 'type') newF[i].value = '';
    setFilters(newF);
  };
  const handleAddFilter = () => {
    if (filters.length < 3 && filters[filters.length - 1].type && filters[filters.length - 1].value) {
      setFilters([...filters, { type: '', value: '' }]);
    }
  };
  const handleRemoveFilter = (idx) => {
    const newF = filters.filter((_, i) => i !== idx);
    setFilters(newF.length ? newF : [{ type: '', value: '' }]);
  };

  // determinar si hay filtro activo con valor
  const advancedActive = filters.some((f) => f.type && f.value);

  // filtrado combinado
  const filtradas = reparaciones.filter((r) => {
    if (!advancedActive && searchQuery) {
      // búsqueda simple
      const hay = Object.values(r).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!hay) return false;
    }
    // aplicar filtros avanzados
    return filters.every((f) => {
      if (!f.type || !f.value) return true;
      return r[f.type]?.toLowerCase().includes(f.value.toLowerCase());
    });
  });

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Historial Reparaciones', link: '/historialreparaciones' },
  ];

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="citasContainer mt-6">
        <form className="flex flex-col">
          <h1 className="services-title text-center">Historial de Reparaciones</h1>

          {/* búsqueda y filtros */}
          <div className="divFiltros">
            {!advancedActive && (
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-64"
              />
            )}
            <div className="flex flex-col space-y-3">
              {filters.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={f.type}
                    onChange={(e) => handleFilterChange(idx, 'type', e.target.value)}
                    className="form-input w-48"
                  >
                    <option value="">Filtro</option>
                    {availableFilterTypes.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                  {f.type && (
                    <select
                      value={f.value}
                      onChange={(e) => handleFilterChange(idx, 'value', e.target.value)}
                      className="form-input w-48"
                    >
                      <option value="">Seleccione {f.type}</option>
                      {[...new Set(reparaciones.map((r) => r[f.type]))].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  )}
                  {f.value && (
                    <button type="button" onClick={() => handleRemoveFilter(idx)} className="textError">
                      X
                    </button>
                  )}
                </div>
              ))}
              {!filters.some((f) => !f.type || !f.value) && filters.length < 3 && (
                <button type="button" onClick={handleAddFilter} className="button-yellow w-40">
                  Agregar Filtro
                </button>
              )}
            </div>
          </div>

          {/* cards */}
          <div className="mt-6">
            {filtradas.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtradas.map((r, idx) => (
                  <div
                    key={idx}
                    className="reparacion-card card-transition p-10 rounded-xl shadow-2xl w-full max-w-sm"
                  >
                    <div className="mb-4">
                      <span className="detalle-label">Marca/Modelo:</span>{' '}
                      <span className="detalle-costo block whitespace-normal break-words">
                        {r.marca} {r.modelo}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="detalle-label">Servicio:</span>{' '}
                      <span className="detalle-costo block whitespace-normal break-words">
                        {r.servicio}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="detalle-label">Fecha y Hora:</span>{' '}
                      <span className="detalle-costo">{new Date(r.fechaHora).toLocaleString()}</span>
                    </div>
                    <div className="mb-4">
                      <span className="detalle-label">Trabajador:</span>{' '}
                      <span className="detalle-costo">{r.trabajador}</span>
                    </div>
                    <div className="mb-4">
                      <span className="detalle-label">Comentario:</span>{' '}
                      <span className="detalle-costo block whitespace-normal break-words">
                        {r.comentario}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="detalle-label">Total:</span>{' '}
                      <span className="detalle-costo">${r.costo}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia text-center">
                No se encontraron reparaciones con los filtros aplicados.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default HistorialReparaciones;
