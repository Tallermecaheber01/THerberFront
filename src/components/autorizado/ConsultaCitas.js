import React, { useEffect, useState } from "react";
import Breadcrumbs from "../Breadcrumbs";
import { getAppointmentsWithServices } from "../../api/employ";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="modal-content bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onConfirm} className="btn-aceptar">
            Confirmar
          </button>
          <button onClick={onCancel} className="btn-cancelar ">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

function ConsultarCitas() {
  const staticBreadcrumbs = [
    { name: "Inicio", link: "/" },
    { name: "Consultar Citas", link: "/consultarcitas" }
  ];

  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await getAppointmentsWithServices();
        console.log("Datos obtenidos de las citas:", appointmentsData);

        // Transformar los datos según la nueva estructura
        const formattedAppointments = appointmentsData.map((appointment) => ({
          id: appointment.appointment_id,
          cliente: appointment.nombreCliente,
          servicio: appointment.services.map((service) => service.servicio).join(", "), // Combina todos los servicios en un solo string
          fecha: new Date(appointment.fecha).toLocaleDateString(), // Formatea la fecha si lo necesitas
          hora: appointment.hora,
          costo: appointment.total,
          marca: appointment.marca,
          modelo: appointment.modelo
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Datos de ejemplo de las citas.
  const [citas] = useState([
    {
      id: 1,
      cliente: 'Juan Pérez',
      servicio: 'Cambio de aceite',
      fecha: '2025-01-05',
      hora: '10:00',
      costo: 50,
      marca: 'Toyota',
      modelo: 'Corolla 2019',
    },
    {
      id: 2,
      cliente: 'María Gómez',
      servicio: 'Revisión general',
      fecha: '2025-01-06',
      hora: '12:00',
      costo: 75,
      marca: 'Honda',
      modelo: 'Civic 2018',
    },
    {
      id: 3,
      cliente: 'Carlos López',
      servicio: 'Cambio de llantas',
      fecha: '2025-01-05',
      hora: '14:00',
      costo: 100,
      marca: 'Ford',
      modelo: 'Focus 2020',
    },
  ]);

  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitaForFinalize, setSelectedCitaForFinalize] = useState(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isExtraRepairModalOpen, setIsExtraRepairModalOpen] = useState(false);

  const availableFilterTypes = [
    'cliente',
    'servicio',
    'marca',
    'modelo',
    'costo',
  ];

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
        filter.type.charAt(0).toUpperCase() +
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

  // Filtra la lista de citas usando la búsqueda básica y filtros avanzados.
  const filteredCitas = appointments.filter((cita) => {
    const matchesSearch =
      searchQuery === '' ||
      Object.values(cita).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === '' || filter.value.trim() === '') return true;
      const citaField = cita[filter.type.toLowerCase()];
      if (!citaField) return false;
      return normalizeStr(String(citaField)).includes(
        normalizeStr(filter.value)
      );
    });
    return matchesSearch && matchesAdvanced;
  });

  const handleFinalizarServicioClick = (citaSeleccionada) => {
    setSelectedCitaForFinalize(citaSeleccionada);
    setIsFinishModalOpen(true);
  };

  const confirmFinalizarServicio = () => {
    if (selectedCitaForFinalize) {
      localStorage.setItem(
        'selectedCita',
        JSON.stringify(selectedCitaForFinalize)
      );
      window.location.href = '/registroreparaciones';
    }
  };

  const handleReparacionExtraClick = () => {
    setIsExtraRepairModalOpen(true);
  };

  const confirmReparacionExtra = () => {
    localStorage.removeItem('selectedCita');
    window.location.href = '/registroreparaciones';
  };

  return (
    <div>
      <Breadcrumbs
        paths={dynamicBreadcrumbs}
        onCrumbClick={handleBreadcrumbClick}
      />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Consultar Citas Próximas</h1>
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {filters.length === 1 &&
              filters[0].type.trim() === '' &&
              filters[0].value.trim() === '' && (
                <input
                  type="text"
                  placeholder="Buscar citas"
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
                    {availableFilterTypes
                      .filter((type) => {
                        if (filter.type === type) return true;
                        return !filters.some(
                          (f, i) => i !== index && f.type === type
                        );
                      })
                      .map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>
                  <input
                    type={
                      filter.type.toLowerCase() === 'costo' ? 'number' : 'text'
                    }
                    placeholder="Busqueda"
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(index, 'value', e.target.value)
                    }
                    className="form-input w-64 text-right"
                  />
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
            <h2 className="cita-title text-center">Citas Programadas</h2>
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
                      <span className="detalle-label">Fecha: </span>
                      <span className="detalle-costo">{cita.fecha}</span>
                    </div>
                    <div className="mb-2">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{cita.hora}</span>
                    </div>
                    {cita.costo !== undefined && (
                      <div className="mb-2">
                        <span className="detalle-label">Costo: </span>
                        <span className="detalle-costo">${cita.costo}</span>
                      </div>
                    )}
                    {cita.marca && (
                      <div className="mb-2">
                        <span className="detalle-label">Marca: </span>
                        <span className="detalle-costo">{cita.marca}</span>
                      </div>
                    )}
                    {cita.modelo && (
                      <div className="mb-2">
                        <span className="detalle-label">Modelo: </span>
                        <span className="detalle-costo">{cita.modelo}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-aceptar w-full mt-2"
                      onClick={() => handleFinalizarServicioClick(cita)}
                    >
                      Finalizar Servicio
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia">
                No se encontraron citas con los filtros aplicados.
              </p>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="btn-aceptar"
              onClick={handleReparacionExtraClick}
            >
              Registrar una Reparación Extra
            </button>
          </div>
        </form>
      </div>
      {isFinishModalOpen && (
        <ConfirmationModal
          title={
            <span className="text-yellow-500">
              Confirmar Finalización del Servicio
            </span>
          }
          message={
            <>
              ¿Estás seguro de finalizar el servicio para{' '}
              <span className="text-yellow-500 font-bold">
                {selectedCitaForFinalize?.cliente}
              </span>
              ?
            </>
          }
          onConfirm={confirmFinalizarServicio}
          onCancel={() => setIsFinishModalOpen(false)}
        />
      )}

      {isExtraRepairModalOpen && (
        <ConfirmationModal
          title={
              <span className="text-yellow-500">
                  Confirmar la finalizacion de un servicio Extra
              </span>
          }
          message={<>¿Deseas registrar una reparación extra sin cita previa?</>}
          onConfirm={confirmReparacionExtra}
          onCancel={() => setIsExtraRepairModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ConsultarCitas;
