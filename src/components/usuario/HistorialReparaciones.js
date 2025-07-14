import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { getRepairHistory } from '../../api/client';

function HistorialReparaciones() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableFilterTypes = [
    { key: 'trabajador', label: 'Nombre Empleado' },
    { key: 'servicio', label: 'Servicio' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRepairHistory();

        const datosTransformados = data.map((item) => {
          let servicioParseado;
          try {
            servicioParseado = JSON.parse(item.servicio);
          } catch {
            servicioParseado = item.servicio;
          }

          return {
            marca: item.marca || '',
            modelo: item.modelo || '',
            servicio: Array.isArray(servicioParseado)
              ? servicioParseado.join(', ')
              : servicioParseado || '',
            fechaHora: item.fechaHoraAtencion || '',
            trabajador: item.nombre_completo_empleado || '',
            comentario: item.comentario || 'No hay comentarios',
            costo: parseFloat(item.totalFinal) || 0,
          };
        });

        setReparaciones(datosTransformados);
      } catch (err) {
        setError('Error al cargar el historial de reparaciones.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFilterChange = (i, field, val) => {
    const newF = [...filters];
    newF[i] = { ...newF[i], [field]: val };
    if (field === 'type') newF[i].value = '';
    setFilters(newF);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
      filters[filters.length - 1].value
    ) {
      setFilters([...filters, { type: '', value: '' }]);
    }
  };

  const handleRemoveFilter = (idx) => {
    const newF = filters.filter((_, i) => i !== idx);
    setFilters(newF.length ? newF : [{ type: '', value: '' }]);
  };

  const advancedActive = filters.some((f) => f.type && f.value);

  const filtradas = reparaciones.filter((r) => {
    if (!advancedActive && searchQuery) {
      const hay = Object.values(r).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!hay) return false;
    }
    return filters.every((f) => {
      if (!f.type || !f.value) return true;
      return (r[f.type]?.toString().toLowerCase() || '').includes(f.value.toLowerCase());
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
                disabled={loading}
              />
            )}
            <div className="flex flex-col space-y-3">
              {filters.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={f.type}
                    onChange={(e) => handleFilterChange(idx, 'type', e.target.value)}
                    className="form-input w-48"
                    disabled={loading}
                  >
                    <option value="">Filtro</option>
                    {availableFilterTypes.map(({ key, label }) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {f.type && (
                    <select
                      value={f.value}
                      onChange={(e) => handleFilterChange(idx, 'value', e.target.value)}
                      className="form-input w-48"
                      disabled={loading}
                    >
                      <option value="">
                        Seleccione {availableFilterTypes.find((a) => a.key === f.type)?.label}
                      </option>
                      {[...new Set(reparaciones.map((r) => r[f.type]))].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  )}
                  {f.value && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(idx)}
                      className="textError"
                      disabled={loading}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              {!filters.some((f) => !f.type || !f.value) && filters.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddFilter}
                  className="button-yellow w-40"
                  disabled={loading}
                >
                  Agregar Filtro
                </button>
              )}
            </div>
          </div>

          {/* mensajes de estado */}
          {loading && <p className="text-center mt-6">Cargando reparaciones...</p>}
          {error && <p className="text-center mt-6 text-red-600">{error}</p>}

          {/* cards */}
          <div className="mt-6">
            {!loading && filtradas.length > 0 ? (
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
              !loading && (
                <p className="advertencia text-center">
                  No se encontraron reparaciones con los filtros aplicados.
                </p>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default HistorialReparaciones;
