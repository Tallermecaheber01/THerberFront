import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { getAppointments, cancelAppointment } from '../../api/client'; // ✅ Import cancelAppointment
import Swal from 'sweetalert2';

function Consulta_cita() {
  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta cita', link: '/consultacita' },
  ];

  const [appointments, setAppointments] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const availableFilterTypes = ['trabajador', 'servicio', 'estado'];
  const appliedFilterTypes = filters.map((filter) => filter.type);

  const optionsByFilter = React.useMemo(() => {
    const trabajadores = [...new Set(appointments.map(a => a.nombreCompletoPersonal))];
    const servicios = [...new Set(appointments.flatMap(a => a.servicios.map(s => s.nombreServicio)))];
    const estados = [...new Set(appointments.map(a => a.estado))];
    return {
      trabajador: trabajadores,
      servicio: servicios,
      estado: estados,
    };
  }, [appointments]);

  const fetchData = async () => {
    try {
      const appointmentsResponse = await getAppointments();
      setAppointments(appointmentsResponse);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ''
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: filter.type,
      link: '#',
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

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

  const handleAgregarCita = () => {
    navigate('/agregarCita');
  };

  const handleCambiarCita = (id) => {
    navigate(`/cambiarCita/${id}`);
  };

  // ✅ Función actualizada con llamada al backend
  const handleCancelarCita = async (idCita) => {
    const { isConfirmed, value: motivo } = await Swal.fire({
      title: '¿Cancelar cita?',
      html: `
        <p>Por favor ingresa el motivo de la cancelación:</p>
        <textarea id="motivoTextarea" class="swal2-textarea" placeholder="Escribe el motivo aquí..."></textarea>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      preConfirm: () => {
        const motivo = document.getElementById('motivoTextarea').value.trim();
        if (!motivo) {
          Swal.showValidationMessage('Debes ingresar un motivo');
          return false;
        }
        return motivo;
      }
    });

    if (isConfirmed) {
      try {
        await cancelAppointment(idCita, {
          canceladoPor: 'Cliente',
          motivo,
        });

        setAppointments((prev) =>
          prev.filter((cita) => cita.idCita !== idCita)
        );
        setSelectedCita(null);

        await Swal.fire({
          title: 'Cita cancelada',
          text: 'La cita ha sido cancelada con éxito.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error('Error al cancelar la cita:', error);
        Swal.fire('Error', 'No se pudo cancelar la cita.', 'error');
      }
    }
  };

  const handleVerDetalles = (idCita) => {
    setSelectedCita(appointments.find((cita) => cita.idCita === idCita));
  };

  const handleCerrarDetalles = () => {
    setSelectedCita(null);
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = {
      ...newFilters[index],
      [field]: value,
    };
    if (field === 'type') newFilters[index].value = '';
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type &&
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

  const filteredCitas = appointments.filter((cita) => {
    return (
      (searchQuery === '' ||
        Object.values(cita).some((value) => {
          return (
            typeof value === 'string' &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })) &&
      filters.every((filter) => {
        if (!filter.type || !filter.value) return true;

        if (filter.type === 'trabajador') {
          return cita.nombreCompletoPersonal
            ?.toLowerCase()
            .includes(filter.value.toLowerCase());
        }

        if (filter.type === 'servicio') {
          return cita.servicios.some((servicio) =>
            servicio.nombreServicio
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          );
        }

        if (filter.type === 'estado') {
          return cita.estado?.toLowerCase().includes(filter.value.toLowerCase());
        }

        return true;
      })
    );
  });

  useEffect(() => {
    if (
      selectedCita &&
      !filteredCitas.some((cita) => cita.id === selectedCita.id)
    ) {
      setSelectedCita(null);
    }
  }, [filteredCitas, selectedCita]);

  return (
    <div className="pt-20">
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <div className="services-section">
        <div className="services-container">
          <h2 className="services-title">Citas del Mes</h2>

          <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-end gap-4 mb-8">
            {filters.length === 1 && filters[0].value.trim() === '' && (
              <input
                type="text"
                placeholder="Buscar citas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-72"
              />
            )}

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
                    <option value="">Consulta avanzada</option>
                    {availableFilterTypes
                      .filter(
                        (type) =>
                          !appliedFilterTypes.includes(type) ||
                          type === filter.type
                      )
                      .map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
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
                        Selecciona {filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}
                      </option>
                      {optionsByFilter[filter.type]?.map((opcion) => (
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
                      X
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

          <div className="services-grid">
            {filteredCitas.map((cita) => (
              <div key={cita.idCita} className="service-card card-transition">
                <div className="service-card-content">
                  <h3 className="service-card-title">{cita.nombreCompletoPersonal}</h3>
                  <p className="service-card-text">
                    Fecha: {new Date(cita.fecha).toLocaleDateString('es-ES')} - Hora: {cita.hora.slice(0, 5)}
                  </p>
                  <button
                    className="btn-blue"
                    onClick={() => handleVerDetalles(cita.idCita)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedCita && (
            <div className="bg-cardClaro dark:bg-cardObscuro rounded-lg p-6 mt-8">
              <div className="detalle-content">
                <h3 className="detalle-title">Detalles de la Cita</h3>
                <p className="detalle-descripcion">
                  <strong>Estado:</strong> {selectedCita.estado}
                </p>
                <p className="detalle-descripcion">
                  <strong>Atención por el empleado:</strong>{' '}
                  {selectedCita.nombreCompletoPersonal}
                </p>
                <p className="detalle-descripcion">
                  <strong>Horario:</strong> {new Date(selectedCita.fecha).toLocaleDateString('es-ES')} - {selectedCita.hora.slice(0, 5)}
                </p>
                <p className="detalle-descripcion">
                  <strong>Servicios:</strong>{' '}
                  {selectedCita.servicios.map((servicio) => servicio.nombreServicio).join(', ')}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    className="btn-blue"
                    onClick={() => handleCambiarCita(selectedCita.idCita)}
                  >
                    Cambiar Cita
                  </button>
                  {selectedCita.estado !== 'Cancelada' && (
                    <button
                      className="button-yellow"
                      onClick={() => handleCancelarCita(selectedCita.idCita)}
                    >
                      Cancelar Cita
                    </button>
                  )}
                  <button
                    className="btn-cancelar"
                    onClick={handleCerrarDetalles}
                  >
                    Cerrar detalles
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-center w-1/2 mx-auto">
              <button className="btn-aceptar" onClick={handleAgregarCita}>
                Agregar Nueva Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consulta_cita;
