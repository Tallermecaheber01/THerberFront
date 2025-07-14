import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { getVehicles, updateVehicle, deleteVehicle } from '../../api/client';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function ConsultaVehiculos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([{ type: '', value: '' }]);


  const [vehicles, setVehicles] = useState([]);

  const fetchData = async () => {
    try {
      const vehiclesResponse = await getVehicles();
      console.log('Vehículos obtenidos:', vehiclesResponse);
      setVehicles(vehiclesResponse);
    } catch (error) {
      console.log('Error al obtener vehículos:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const availableFilterTypes = ['marca', 'modelo', 'año'];

  // Estados para inline editing
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ año: '', placa: '', vin: '' });

  // Filtros
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
  const advancedActive = filters.some((f) => f.type && f.value);

  // Búsqueda / filtrado
  const filtrados = vehicles.filter((v) => {
    if (!advancedActive && searchQuery) {
      return Object.values(v).some(val => val.toString().toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filters.every((f) => {
      if (!f.type || !f.value) return true;
      return v[f.type]?.toString().toLowerCase().includes(f.value.toLowerCase());
    });
  });

  // Handlers inline edit
  const handleEditClick = (v) => {
    setEditingId(v.id);
    setFormData({ año: v.año, placa: v.placa, vin: v.vin });




  };
  const handleCancel = () => {
    setEditingId(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSave = async (id) => {
    try {
      const response = await updateVehicle(id, formData);
      if (response) {
        toast.success('Vehículo actualizado exitosamente');
        setVehicles(prev =>
          prev.map(v =>
            v.id === id
              ? { ...v, año: parseInt(formData.año, 10), placa: formData.placa, vin: formData.vin }
              : v
          )
        );
      } else {
        toast.error('Error al actualizar el vehículo');
      }
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      toast.error('Ocurrió un error al actualizar el vehículo. Por favor, inténtalo de nuevo.');
    } finally {
      setEditingId(null);
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el vehículo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteVehicle(id);
        toast.success('Vehículo eliminado exitosamente');
        setVehicles(prev => prev.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        toast.error('Ocurrió un error al eliminar el vehículo');
      }
    }
  };




  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consultar Vehículos', link: '/consultavehiculos' },
  ];

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="citasContainer mt-6">
        <form className="flex flex-col">
          <h1 className="services-title text-center">Consulta de Vehículos</h1>

          {/* filtros */}
          <div className="divFiltros">
            {!advancedActive && (
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input w-64"
              />
            )}
            <div className="flex flex-col space-y-3">
              {filters.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={f.type}
                    onChange={e => handleFilterChange(idx, 'type', e.target.value)}
                    className="form-input w-48"
                  >
                    <option value="">Filtro</option>
                    {availableFilterTypes.map(opt => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                  {f.type && (
                    <select
                      value={f.value}
                      onChange={e => handleFilterChange(idx, 'value', e.target.value)}
                      className="form-input w-48"
                    >
                      <option value="">Seleccione {f.type}</option>
                      {[...new Set(vehicles.map(v => v[f.type]))].map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  )}
                  {f.value && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(idx)}
                      className="textError"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              {!filters.some(f => !f.type || !f.value) && filters.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddFilter}
                  className="button-yellow w-40"
                >
                  Agregar Filtro
                </button>
              )}
            </div>
          </div>

          {/* Resultados con inline edit */}
          <div className="mt-6">
            {filtrados.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtrados.map(v => (
                  <div
                    key={v.id}
                    className="reparacion-card card-transition p-8 rounded-xl shadow-2xl text-lg
                      w-full sm:w-[300px] md:w-[400px] lg:w-[500px] h-auto min-h-[250px] mx-auto"
                  >
                    <div>
                      <span className="detalle-label">Marca:</span>{' '}
                      <span className="detalle-costo">{v.marca}</span>
                    </div>
                    <div>
                      <span className="detalle-label">Modelo:</span>{' '}
                      <span className="detalle-costo">{v.modelo}</span>
                    </div>
                    <div>
                      <span className="detalle-label">Numero de Serie:</span>{' '}
                      <span className="detalle-costo">{v.numeroSerie}</span>
                    </div>
                    <div>
                      <span className="detalle-label">Año:</span>{' '}
                      {editingId === v.id ? (
                        <input
                          type="number"
                          name="año"
                          value={formData.año}
                          onChange={handleChange}
                          className="form-input w-24 inline-block"
                        />
                      ) : (
                        <span className="detalle-costo">{v.año}</span>
                      )}
                    </div>
                    <div>
                      <span className="detalle-label">Placa:</span>{' '}
                      {editingId === v.id ? (
                        <input
                          type="text"
                          name="placa"
                          value={formData.placa}
                          onChange={handleChange}
                          className="form-input w-32 inline-block"
                        />
                      ) : (
                        <span className="detalle-costo">{v.placa}</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className="detalle-label">VIN:</span>{' '}
                      {editingId === v.id ? (
                        <input
                          type="text"
                          name="VIN"
                          value={formData.VIN}
                          onChange={handleChange}
                          className="form-input w-full inline-block"
                        />
                      ) : (
                        <span
                          className="detalle-costo truncate max-w-full block"
                          title={v.VIN}
                        >
                          {v.VIN}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                      {editingId === v.id ? (
                        <>
                          <button
                            type="button"
                            className="btn-aceptar w-24"
                            onClick={() => handleSave(v.id)}
                          >
                            Aceptar
                          </button>
                          <button
                            type="button"
                            className="btn-cancelar w-24"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="button-yellow w-24"
                            onClick={() => handleEditClick(v)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-cancelar w-24"
                            onClick={() => handleDeleteClick(v.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia text-center">
                No se encontraron vehículos con los filtros aplicados.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsultaVehiculos;
