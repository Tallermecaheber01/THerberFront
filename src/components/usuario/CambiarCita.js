import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllServices } from '../../api/admin';
import { getAppointmentById, updateAppointmentDate } from '../../api/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CambiarCita() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [fechaActual, setFechaActual] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({});
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [busquedaServicio, setBusquedaServicio] = useState('');

  const [trabajadorAsignado, setTrabajadorAsignado] = useState('');

  const formatearFechaHora = (fechaISO, horaStr) => {
    if (!fechaISO || !horaStr) return '';
    const fechaParte = fechaISO.slice(0, 10);
    const horaMinutos = horaStr.slice(0, 5);
    return `${fechaParte}T${horaMinutos}`;
  };

  const formatDate = dateTimeLocal => {
    if (!dateTimeLocal) return 'Fecha inválida';
    const date = new Date(dateTimeLocal);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleString('es-ES', { hour12: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await getAllServices();
        setServicios(servicesResponse);

        const cita = await getAppointmentById(id);
        console.log('📅 Cita obtenida:', cita);

        setTrabajadorAsignado(cita.nombreCompletoPersonal || 'Sin asignar');

        const fechaHoraInput = formatearFechaHora(cita.fecha, cita.hora);
        setFechaActual(fechaHoraInput);
        setNuevaFecha(fechaHoraInput);

        const seleccionInicial = {};
        servicesResponse.forEach(s => {
          seleccionInicial[s.id] = false;
        });
        cita.servicios.forEach(s => {
          seleccionInicial[s.idServicio] = true;
        });
        setServiciosSeleccionados(seleccionInicial);
      } catch (error) {
        console.error('Error al cargar cita o servicios:', error);
      }
    };
    fetchData();
  }, [id]);

  const manejarServicioToggle = id => {
    setServiciosSeleccionados(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const manejarNuevaFechaChange = e => setNuevaFecha(e.target.value);

  const manejarEnviar = async e => {
    e.preventDefault();
    console.log('🛠️ Modificando cita con ID:', id);

    const [fecha, hora] = nuevaFecha.split('T');

    const serviciosSeleccionadosFinal = servicios
      .filter(s => serviciosSeleccionados[s.id])
      .map(s => s.nombre);

    const datosAEnviar = {
      fecha,
      hora,
      servicios: serviciosSeleccionadosFinal,
    };

    try {
      console.log('Datos a enviar:', datosAEnviar);
      await updateAppointmentDate(id, datosAEnviar);
      toast.success('Solicitud de cambio de cita enviado correctamente.');
      setTimeout(() => navigate('/consultacita'), 3000);
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      toast.error('Hubo un error al actualizar la cita.');
    }
  };

  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  const seleccionados = servicios.filter(s => serviciosSeleccionados[s.id]);

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Cita', link: '/consultacita' },
    { name: 'Editar Cita', link: '/editarcita' },
  ];

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs paths={breadcrumbPaths} />

      <form onSubmit={manejarEnviar} className="form-card p-6 max-w-6xl mx-auto">
        <h2 className="form-title mb-6">Solicitar Cambio de Cita</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Fecha y Hora Actual</label>
              <p className="cita-subtitle">{formatDate(fechaActual)}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Trabajador Asignado</label>
              <p className="cita-subtitle">{trabajadorAsignado}</p>
            </div>

            <div className="form-group">
              <label htmlFor="nueva-fecha" className="form-label">
                Nueva Fecha y Hora
              </label>
              <input
                id="nueva-fecha"
                type="datetime-local"
                value={nuevaFecha}
                onChange={manejarNuevaFechaChange}
                className="form-input"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setMostrarServicios(!mostrarServicios)}
              className="button-yellow mt-2"
            >
              {mostrarServicios ? 'Ocultar Servicios' : 'Agregar Servicios'}
            </button>

            {mostrarServicios && (
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  value={busquedaServicio}
                  onChange={e => setBusquedaServicio(e.target.value)}
                  className="form-input"
                />
                {serviciosFiltrados.map(srv => (
                  <label key={srv.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={serviciosSeleccionados[srv.id] || false}
                      onChange={() => manejarServicioToggle(srv.id)}
                      className="form-checkbox"
                    />
                    <span>{srv.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded space-y-2">
              <h3 className="font-semibold">Resumen de Cambio</h3>
              <p><strong>Fecha Actual:</strong> {formatDate(fechaActual)}</p>
              <p><strong>Nueva Fecha:</strong> {formatDate(nuevaFecha)}</p>
              <div>
                <strong>Servicios:</strong>
                {seleccionados.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {seleccionados.map(srv => (
                      <li key={srv.id} className="flex justify-between">
                        {srv.nombre}
                        <button
                          type="button"
                          onClick={() => manejarServicioToggle(srv.id)}
                          className="text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> Ninguno</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-aceptar py-1 flex-1">
                Confirmar Cambio
              </button>
              <button
                type="button"
                className="btn-cancelar py-1 flex-1"
                onClick={() => navigate('/consultacita')}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CambiarCita;
