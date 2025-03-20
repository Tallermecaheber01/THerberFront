import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { getAppointmentsInWaiting, getAllEmployees, updateWaitingAppointment, rejectAppointment } from '../../api/employ';
import { AuthContext } from '../AuthContext';

function AprobacionesCitas() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appoinmentInWaiting, setAppointmentInWaiting] = useState([]);
  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentData = await getAppointmentsInWaiting();
        const employData = await getAllEmployees();
        console.log("Respuesta:", appointmentData);
        console.log("Empleados:", employData);
        setAppointmentInWaiting(appointmentData);
        setEmployes(employData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedCita, setSelectedCita] = useState(null);
  const [total, setTotal] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [isRejectionMode, setIsRejectionMode] = useState(false);
  const [razonRechazo, setRazonRechazo] = useState('');
  const [approvalErrors, setApprovalErrors] = useState({});
  const [showConfirmApproveModal, setShowConfirmApproveModal] = useState(false);

  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Aprobaciones de Citas', link: '/aprobacioncitas' },
  ];
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const availableFilterTypes = ['marca', 'cliente', 'servicio'];
  const appliedFilterTypes = filters.map((filter) => filter.type);
  const optionsByFilter = {
    marca: ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Nissan'],
    servicio: [
      'Cambio de aceite',
      'Revisión de frenos',
      'Cambio de batería',
      'Revisión de suspensión',
      'Reparación de aire acondicionado',
    ],
  };

  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type && filter.value.trim() !== ''
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name: `${filter.type}: ${filter.value}`,
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
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
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

  const filteredCitas = appoinmentInWaiting.filter((cita) => {
    // Filtrar solo las citas que están en estado 'En espera'
    if (cita.estado !== 'En espera') return false;

    // Buscar coincidencias en los valores de la cita
    const matchesSearch =
      searchQuery === '' ||
      Object.values(cita).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.length > 0 && value.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

    // Filtrar por los filtros proporcionados
    const matchesFilters = filters.every((filter) => {
      if (!filter.type || !filter.value) return true;

      const field = filter.type.toLowerCase();

      // Verificación especial para 'servicio', buscamos dentro de 'services'
      if (field === 'servicio') {
        return (
          Array.isArray(cita.services) &&
          cita.services.some((service) =>
            service.servicio.toLowerCase().includes(filter.value.toLowerCase())
          )
        );
      }

      return cita[field]?.toLowerCase().includes(filter.value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  useEffect(() => {
    if (
      selectedCita &&
      !filteredCitas.some((cita) => cita.appointment_id === selectedCita.appointment_id)
    ) {
      setSelectedCita(null);
    }
  }, [filteredCitas, selectedCita]);

  const handleSelectCita = (id) => {
    const citaSeleccionada = appoinmentInWaiting.find(cita => cita.appointment_id === id);
    setSelectedCita(citaSeleccionada);
    setTotal('');
    setSelectedEmpleado('');
    setIsRejectionMode(false);
    setRazonRechazo('');
    setApprovalErrors({});
  };

  const handleCancelSelection = () => {
    setSelectedCita(null);
    setTotal('');
    setSelectedEmpleado('');
    setIsRejectionMode(false);
    setRazonRechazo('');
    setApprovalErrors({});
  };

  const isInputSecure = (value) => {
    if (
      value.includes("'") ||
      value.includes('"') ||
      value.includes(';') ||
      value.includes('--') ||
      value.includes('/*') ||
      value.includes('*/')
    ) {
      return false;
    }
    return true;
  };

  const handleAttemptApprove = () => {
    console.log("Empleado seleccionado en handleAttemptApprove:", selectedEmpleado);

    const errors = {};

    if (total.trim() === '') {
      errors.total = 'El total es obligatorio.';
    } else if (isNaN(total)) {
      errors.total = 'El total debe ser un número.';
    } else if (parseFloat(total) < 0) {
      errors.total = 'El total no puede ser negativo.';
    }
    if (!selectedEmpleado) {
      errors.selectedEmpleado = 'Debe seleccionar un empleado.';
    }
    if (!isInputSecure(total)) {
      errors.total = 'El total contiene caracteres no permitidos.';
    }
    if (!isInputSecure(selectedEmpleado)) {
      errors.selectedEmpleado = 'El empleado seleccionado contiene caracteres no permitidos.';
    }
    if (Object.keys(errors).length > 0) {
      setApprovalErrors(errors);
      return;
    }
    setApprovalErrors({});
    setShowConfirmApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedEmpleado) {
      setApprovalErrors((prevErrors) => ({
        ...prevErrors,
        empleado: "Por favor, seleccione un empleado",
      }));
      console.log("Empleado no seleccionado.");
      return;
    }

    console.log("Citas antes de la actualización:", appoinmentInWaiting);
    console.log("Cita seleccionada:", selectedCita);
    console.log("Total que se enviará:", Number(total));
    console.log("Empleado:", Number(selectedEmpleado));

    try {
      const updatedAppointment = await updateWaitingAppointment(selectedCita.appointment_id, {
        IdPersonal: Number(selectedEmpleado),
        total: Number(total),
        estado: "Confirmada",
      });

      console.log("Respuesta de la API:", updatedAppointment);

      setAppointmentInWaiting((prevCitas) =>
        prevCitas.map((cita) =>
          cita.appointment_id === selectedCita.appointment_id
            ? {
                ...cita,
                estado: "Confirmada",
                total: Number(total),
                nombreEmpleado: selectedEmpleado,
              }
            : cita
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
    }

    setShowConfirmApproveModal(false);
    setSelectedCita(null);
    setTotal("");
    setSelectedEmpleado("");
    setApprovalErrors({});
  };

  const handleEnterRejection = () => {
    setIsRejectionMode(true);
    setApprovalErrors({});
  };

  const handleConfirmRejection = async () => {
    if (razonRechazo.trim() !== '' && /^\d+$/.test(razonRechazo.trim())) {
      setApprovalErrors({
        razonRechazo: 'La razón de rechazo no puede contener solo números.',
      });
      return;
    }

    if (!isInputSecure(razonRechazo)) {
      setApprovalErrors({
        razonRechazo: 'La razón de rechazo contiene caracteres no permitidos.',
      });
      return;
    }

    const idPersonal = auth && auth.user ? auth.user.id : null;

    if (!idPersonal) {
      console.error("No se encontró el ID del personal.");
      return;
    }

    try {
      const data = {
        idCita: selectedCita.appointment_id,
        motivo: razonRechazo,
        idPersonal,
      };

      const response = await rejectAppointment(data);
      console.log("Respuesta de la API:", response);

      setAppointmentInWaiting((prevCitas) =>
        prevCitas.map((cita) =>
          cita.appointment_id === selectedCita.appointment_id
            ? { ...cita, estado: "Rechazada", razonRechazo }
            : cita
        )
      );
    } catch (error) {
      console.error("Error al rechazar la cita:", error);
    }

    setSelectedCita(null);
    setApprovalErrors({});
  };

  const handleCancelRejection = () => {
    setRazonRechazo('');
    setIsRejectionMode(false);
    setApprovalErrors({});
  };

  // Función para filtrar empleados según el rol del usuario autenticado
  const getFilteredEmployees = () => {
    if (auth.role === 'empleado') {
      return employes.filter((empleado) => empleado.id === auth.user.id);
    } else if (auth.role === 'administrador') {
      return employes;
    }
    return [];
  };

  return (
    <div className="pt-20">
      <Breadcrumbs
        paths={getDynamicBreadcrumbs()}
        onCrumbClick={handleBreadcrumbClick}
      />

      <div className="form-container">
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
                {filter.type &&
                  (filter.type === 'cliente' ? (
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, 'value', e.target.value)
                      }
                      className="form-input w-64"
                      placeholder="Escribe el cliente"
                    />
                  ) : (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(index, 'value', e.target.value)
                      }
                      className="form-input w-64"
                    >
                      <option value="">
                        Selecciona{' '}
                        {filter.type.charAt(0).toUpperCase() +
                          filter.type.slice(1)}
                      </option>
                      {optionsByFilter[filter.type].map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ))}
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
        {!selectedCita && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitas.map((cita) => (
              <div
                key={cita.appointment_id}
                className="reparacion-card cursor-pointer card-transition"
                onClick={() => handleSelectCita(cita.appointment_id)}
              >
                <h2 className="cita-title">{cita.appointment_id}</h2>
                <p className="cita-subtitle">Modelo: {cita.modelo}</p>
                <p className="cita-subtitle">Marca: {cita.marca}</p>
                <p className="cita-subtitle">Cliente: {cita.nombreCliente}</p>
                <p className="cita-subtitle">
                  Fecha: {new Date(cita.fecha).toLocaleDateString()} - Hora: {cita.hora}
                </p>
                <p className="cita-subtitle">
                  Servicios: {Array.isArray(cita.services) && cita.services.length > 0
                    ? cita.services.map(service => service.servicio).join(', ')
                    : 'No hay servicios'}
                </p>
              </div>
            ))}
          </div>
        )}
        {selectedCita && (
          <div className="reparacion-card">
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-cancelar w-fit text-xs px-3 py-2"
                onClick={handleCancelSelection}
              >
                X
              </button>
            </div>
            <div className="detalle-descripcion">
              <h2 className="cita-title">{selectedCita.appointment_id}</h2>
              <p className="cita-subtitle">Modelo: {selectedCita.modelo}</p>
              <p className="cita-subtitle">Marca: {selectedCita.marca}</p>
              <p className="cita-subtitle">Cliente: {selectedCita.nombreCliente}</p>
              <p className="cita-subtitle">
                Fecha: {new Date(selectedCita.fecha).toLocaleDateString()} - Hora: {selectedCita.hora}
              </p>
              <p className="cita-subtitle">
                Servicios solicitados:{' '}
                {Array.isArray(selectedCita.services) && selectedCita.services.length > 0
                  ? selectedCita.services.map(service => service.servicio).join(', ')
                  : 'No hay servicios'}
              </p>
            </div>
            {!isRejectionMode && (
              <>
                <div className="form-group">
                  <label htmlFor="total" className="form-label">
                    Total:
                  </label>
                  <input
                    id="total"
                    type="number"
                    className="form-input"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="Ingrese total"
                  />
                  {approvalErrors.total && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.total}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="empleado" className="form-label">
                    Empleado:
                  </label>
                  <select
                    id="empleado"
                    className="form-input"
                    value={selectedEmpleado}
                    onChange={(e) => setSelectedEmpleado(e.target.value)}
                  >
                    <option value="">Seleccione un trabajador</option>
                    {getFilteredEmployees().map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
                      </option>
                    ))}
                  </select>
                  {approvalErrors.selectedEmpleado && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.selectedEmpleado}
                    </p>
                  )}
                </div>
              </>
            )}
            {isRejectionMode && (
              <div className="form-group">
                <label htmlFor="razon" className="form-label">
                  Razón de rechazo:
                </label>
                <textarea
                  id="razon"
                  className="form-input"
                  value={razonRechazo}
                  onChange={(e) => setRazonRechazo(e.target.value)}
                  placeholder="Ingrese la razón del rechazo (no solo números)"
                  rows="4"
                />
                {approvalErrors.razonRechazo && (
                  <p className="text-red-500 text-xs mt-1">
                    {approvalErrors.razonRechazo}
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-4 mt-4">
              {isRejectionMode ? (
                <>
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleConfirmRejection}
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleCancelRejection}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleAttemptApprove}
                  >
                    Aprobar Cita
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleEnterRejection}
                  >
                    Rechazar Cita
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {showConfirmApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl mb-4 text-yellow-500">
              Confirmación de Aprobación
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Está seguro de aprobar la cita con total de ${total} y asignar al empleado {selectedEmpleado}?
            </p>
            <div className="flex justify-end gap-4">
              <button className="btn-aceptar" onClick={confirmApprove}>
                Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowConfirmApproveModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AprobacionesCitas;
