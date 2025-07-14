import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumbs from '../Breadcrumbs';
import {
  getAppointmentsInWaiting, getAllEmployees, updateWaitingAppointment, rejectAppointment,
  getAllServices
} from '../../api/employ';

import { AuthContext } from '../AuthContext';

function AprobacionesCitas() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appoinmentInWaiting, setAppointmentInWaiting] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentData = await getAppointmentsInWaiting();
        const employData = await getAllEmployees();
        const servicesData = await getAllServices();
        setAppointmentInWaiting(appointmentData);
        setEmployes(employData);
        setServices(servicesData);
        console.log("Datos de citas en espera obtenidos:", appointmentData);
        console.log("Datos de empleados obtenidos:", employData);
        console.log("Datos de servicios obtenidos:", servicesData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  // Obtén marcas únicas de las citas en espera
  const marcasUnicas = useMemo(() => {
    const marcas = appoinmentInWaiting.map(cita => cita.marca).filter(Boolean);
    // elimina duplicados
    return [...new Set(marcas)];
  }, [appoinmentInWaiting]);

  const [selectedCita, setSelectedCita] = useState(null);
  const [total, setTotal] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [isRejectionMode, setIsRejectionMode] = useState(false);
  const [razonRechazo, setRazonRechazo] = useState('');
  const [approvalErrors, setApprovalErrors] = useState({});

  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Aprobaciones de Citas', link: '/aprobacioncitas' },
  ];
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const availableFilterTypes = ['marca', 'cliente', 'servicio'];
  const appliedFilterTypes = filters.map((filter) => filter.type);
  const optionsByFilter = {
    marca: marcasUnicas,
    servicio: services.map((s) => s.nombre),
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
    if (cita.estado !== 'En espera') return false;

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

    const matchesFilters = filters.every((filter) => {
      if (!filter.type || !filter.value) return true;

      const field = filter.type.toLowerCase();

      if (field === 'servicio') {
        return (
          Array.isArray(cita.services) &&
          cita.services.some((service) =>
            service.servicio.toLowerCase().includes(filter.value.toLowerCase())
          )
        );
      }

      if (field === 'cliente') {
        return cita.nombreCliente?.toLowerCase().includes(filter.value.toLowerCase());
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

  const handleAttemptApprove = async () => {
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

    // Confirmación con SweetAlert2
    const result = await Swal.fire({
      title: 'Confirmar aprobación',
      html: `¿Está seguro de aprobar la cita con total de <b>$${total}</b> y asignar al empleado <b>${getEmpleadoNombre(selectedEmpleado)}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      confirmApprove();
    }
  };

  const getEmpleadoNombre = (id) => {
    const empleado = employes.find(e => e.id === Number(id));
    return empleado ? empleado.nombre_completo : '';
  };

  const confirmApprove = async () => {
    if (!selectedEmpleado) {
      setApprovalErrors((prevErrors) => ({
        ...prevErrors,
        empleado: "Por favor, seleccione un empleado",
      }));
      return;
    }

    try {
      const updatedAppointment = await updateWaitingAppointment(selectedCita.appointment_id, {
        IdPersonal: Number(selectedEmpleado),
        total: Number(total),
        estado: "Confirmada",
      });

      setAppointmentInWaiting((prevCitas) =>
        prevCitas.map((cita) =>
          cita.appointment_id === selectedCita.appointment_id
            ? {
              ...cita,
              estado: "Confirmada",
              total: Number(total),
              nombreEmpleado: getEmpleadoNombre(selectedEmpleado),
            }
            : cita
        )
      );

      Swal.fire({
        icon: 'success',
        title: '¡Cita aprobada!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo aprobar la cita.',
      });
    }

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
    if (razonRechazo.trim() === '') {
      setApprovalErrors({
        razonRechazo: 'La razón de rechazo es obligatoria.',
      });
      return;
    }

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

    const result = await Swal.fire({
      title: 'Confirmar rechazo',
      html: `¿Está seguro de rechazar la cita?<br/><b>Motivo:</b> ${razonRechazo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const data = {
        idCita: selectedCita.appointment_id,
        motivo: razonRechazo,
        idPersonal,
      };

      await rejectAppointment(data);

      setAppointmentInWaiting((prevCitas) =>
        prevCitas.map((cita) =>
          cita.appointment_id === selectedCita.appointment_id
            ? { ...cita, estado: "Rechazada", razonRechazo }
            : cita
        )
      );

      Swal.fire({
        icon: 'success',
        title: '¡Cita rechazada!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al rechazar la cita:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo rechazar la cita.',
      });
    }

    setSelectedCita(null);
    setApprovalErrors({});
    setRazonRechazo('');
    setIsRejectionMode(false);
  };

  const handleCancelRejection = () => {
    setRazonRechazo('');
    setIsRejectionMode(false);
    setApprovalErrors({});
  };

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
          filteredCitas.length === 0 ? (
            <p className="text-center text-gray-600 text-lg mt-12">No hay citas por aprobar.</p>
          ) : (
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
          )
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
                        {empleado.nombre_completo}
                      </option>
                    ))}
                  </select>
                  {approvalErrors.selectedEmpleado && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.selectedEmpleado}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    className="button-yellow w-44"
                    onClick={handleAttemptApprove}
                  >
                    Aprobar cita
                  </button>
                  <button
                    className="btn-cancelar w-44"
                    onClick={handleEnterRejection}
                  >
                    Rechazar cita
                  </button>
                </div>
              </>
            )}
            {isRejectionMode && (
              <>
                <div className="form-group">
                  <label htmlFor="razonRechazo" className="form-label">
                    Razón de rechazo:
                  </label>
                  <textarea
                    id="razonRechazo"
                    className="form-input"
                    value={razonRechazo}
                    onChange={(e) => setRazonRechazo(e.target.value)}
                    placeholder="Escriba el motivo de rechazo"
                  />
                  {approvalErrors.razonRechazo && (
                    <p className="text-red-500 text-xs mt-1">
                      {approvalErrors.razonRechazo}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    className="button-yellow w-44"
                    onClick={handleConfirmRejection}
                  >
                    Confirmar rechazo
                  </button>
                  <button
                    className="btn-cancelar w-44"
                    onClick={handleCancelRejection}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AprobacionesCitas;
