import React, { useState, useEffect, useContext } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import Swal from 'sweetalert2';
import {
  getAppointmentsPendingChange,
  getAllEmployees,
  updateWaitingAppointment,
  rejectAppointment
} from '../../api/employ';
import { AuthContext } from '../AuthContext';

function AprobacionCambioCita() {
  const { auth } = useContext(AuthContext);

  const [citas, setCitas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const citasResp = await getAppointmentsPendingChange();
        if (Array.isArray(citasResp)) setCitas(citasResp);

        const empleadosResp = await getAllEmployees();
        if (Array.isArray(empleadosResp)) setEmpleados(empleadosResp);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    }
    fetchData();
  }, []);

  const handleSelectCita = (id) => {
    const cita = citas.find(c => c.appointment_id === id);
    setSelectedCita(cita);
    setTotal(cita?.total?.toString() || '');
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
    const forbidden = ["'", '"', ';', '--', '/*', '*/'];
    return !forbidden.some(f => value.includes(f));
  };

  const validateApprove = () => {
    const errors = {};
    if (total.trim() === '') errors.total = 'El total es obligatorio.';
    else if (isNaN(total)) errors.total = 'El total debe ser un número.';
    else if (parseFloat(total) < 0) errors.total = 'El total no puede ser negativo.';
    if (!selectedEmpleado) errors.selectedEmpleado = 'Debe seleccionar un empleado.';
    if (!isInputSecure(total)) errors.total = 'El total contiene caracteres no permitidos.';
    if (!isInputSecure(selectedEmpleado)) errors.selectedEmpleado = 'El empleado seleccionado contiene caracteres no permitidos.';
    return errors;
  };

  const getEmpleadoNombre = (id) => {
    const empleado = empleados.find(e => e.id === Number(id));
    return empleado ? empleado.nombre_completo : '';
  };

  const handleAttemptApprove = async () => {
    const errors = validateApprove();
    if (Object.keys(errors).length > 0) {
      setApprovalErrors(errors);
      return;
    }
    setApprovalErrors({});

    const result = await Swal.fire({
      title: 'Confirmar aprobación',
      html: `¿Está seguro de aprobar el cambio de cita con total de <b>$${total}</b> y asignar al empleado <b>${getEmpleadoNombre(selectedEmpleado)}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      confirmApprove();
    }
  };

  const confirmApprove = async () => {
    try {
      await updateWaitingAppointment(selectedCita.appointment_id, {
        IdPersonal: Number(selectedEmpleado),
        total: Number(total),
        estado: "Reprogramada",
      });

      setCitas(prev =>
        prev.filter(c => c.appointment_id !== selectedCita.appointment_id)
      );

      Swal.fire({
        icon: 'success',
        title: '¡Cita Reprogramada!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo aprobar la cita.',
      });
    }

    handleCancelSelection();
  };

  const handleEnterRejection = () => {
    setIsRejectionMode(true);
    setApprovalErrors({});
  };

  const validateRejection = () => {
    if (razonRechazo.trim() === '') return 'La razón de rechazo es obligatoria.';
    if (/^\d+$/.test(razonRechazo.trim())) return 'La razón de rechazo no puede contener solo números.';
    if (!isInputSecure(razonRechazo)) return 'La razón de rechazo contiene caracteres no permitidos.';
    return null;
  };

  const handleConfirmRejection = async () => {
    const error = validateRejection();
    if (error) {
      setApprovalErrors({ razonRechazo: error });
      return;
    }

    const idPersonal = auth?.user?.id;
    if (!idPersonal) {
      console.error('No se encontró el ID del personal autenticado.');
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
      await rejectAppointment({
        idCita: selectedCita.appointment_id,
        motivo: razonRechazo,
        idPersonal,
      });

      setCitas(prev =>
        prev.filter(c => c.appointment_id !== selectedCita.appointment_id)
      );

      Swal.fire({
        icon: 'success',
        title: '¡Cita rechazada!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al rechazar la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo rechazar la cita.',
      });
    }

    handleCancelSelection();
  };

  const handleCancelRejection = () => {
    setRazonRechazo('');
    setIsRejectionMode(false);
    setApprovalErrors({});
  };

  const getFilteredEmployees = () => {
    if (auth?.role === 'empleado') {
      return empleados.filter(e => e.id === auth.user.id);
    } else if (auth?.role === 'administrador') {
      return empleados;
    }
    return [];
  };

  return (
    <div className="pt-20">
      <Breadcrumbs paths={staticBreadcrumbs} />
      <div className="form-container">
        {!selectedCita ? (
          citas.length === 0 ? (
            <p className="text-center text-gray-600 text-lg mt-12">No hay citas por aprobar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {citas.map(cita => (
                <div
                  key={cita.appointment_id}
                  className="reparacion-card cursor-pointer"
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
                    Servicios:{' '}
                    {Array.isArray(cita.services) && cita.services.length > 0
                      ? cita.services.map(s => s.servicio).join(', ')
                      : 'Sin servicio'}
                  </p>
                  <p className="cita-subtitle font-semibold">Estado: {cita.estado}</p>
                  {cita.nombreEmpleado && (
                    <p className="cita-subtitle font-semibold">
                      Empleado asignado: {cita.nombreEmpleado}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
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
                Servicios:{' '}
                {Array.isArray(selectedCita.services) && selectedCita.services.length > 0
                  ? selectedCita.services.map(s => s.servicio).join(', ')
                  : 'Sin servicio'}
              </p>
            </div>

            {!isRejectionMode ? (
              <>
                <div className="form-group">
                  <label className="form-label">Total:</label>
                  <input
                    type="number"
                    className="form-input"
                    value={total}
                    onChange={e => setTotal(e.target.value)}
                    placeholder="Ingrese el total"
                  />
                  {approvalErrors.total && (
                    <p className="text-red-500 text-xs mt-1">{approvalErrors.total}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Empleado:</label>
                  <select
                    className="form-input"
                    value={selectedEmpleado}
                    onChange={e => setSelectedEmpleado(e.target.value)}
                  >
                    <option value="">Seleccione un trabajador</option>
                    {getFilteredEmployees().map(e => (
                      <option key={e.id} value={e.id}>
                        {e.nombre_completo}
                      </option>
                    ))}
                  </select>
                  {approvalErrors.selectedEmpleado && (
                    <p className="text-red-500 text-xs mt-1">{approvalErrors.selectedEmpleado}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Razón de rechazo:</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Motivo del rechazo"
                  value={razonRechazo}
                  onChange={e => setRazonRechazo(e.target.value)}
                />
                {approvalErrors.razonRechazo && (
                  <p className="text-red-500 text-xs mt-1">{approvalErrors.razonRechazo}</p>
                )}
              </div>
            )}

            <div className="flex gap-4 mt-4">
              {isRejectionMode ? (
                <>
                  <button className="btn-aceptar" onClick={handleConfirmRejection}>
                    Confirmar Rechazo
                  </button>
                  <button className="btn-cancelar" onClick={handleCancelRejection}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-aceptar" onClick={handleAttemptApprove}>
                    Aprobar Cita
                  </button>
                  <button className="btn-cancelar" onClick={handleEnterRejection}>
                    Rechazar Cita
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AprobacionCambioCita;
