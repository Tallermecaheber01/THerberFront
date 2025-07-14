import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { getVehicles, createAppointment } from '../../api/client';
import { getAllServices } from '../../api/admin';
import { ToastContainer, toast } from 'react-toastify';

function AgregarCita() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [diagnostico, setDiagnostico] = useState(false);
  const [servSeleccionados, setServSeleccionados] = useState({});
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [busquedaServ, setBusquedaServ] = useState('');
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios1, setServicios] = useState([]);

  const fetchData = async () => {
    try {
      const vehiclesResponse = await getVehicles();
      const servicesResponse = await getAllServices();
      setVehiculos(vehiclesResponse);
      setServicios(servicesResponse);
    } catch (error) {
      console.log('Error al obtener vehículos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetFormulario = () => {
    setFecha('');
    setMarca('');
    setModelo('');
    setDiagnostico(false);
    setServSeleccionados({});
    setMostrarServicios(false);
    setBusquedaServ('');
  };

  const marcasUnicas = [...new Set(vehiculos.map(v => v.marca))];
  const modelosFiltrados = vehiculos.filter(v => v.marca === marca).map(v => v.modelo);

  const servFiltrados = servicios1.filter(s =>
    s.nombre.toLowerCase().includes(busquedaServ.toLowerCase())
  );

  const seleccionados = servicios1.filter(s => servSeleccionados[s.id]);

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Cita', link: '/consultacita' },
    { name: 'Solicitar Cita', link: '/agregarCita' },
  ];

  const manejarEnviar = async e => {
    e.preventDefault();

    const fechaObj = new Date(fecha);
    const fechaStr = fechaObj.toISOString().split('T')[0];
    const horaStr = fechaObj.toTimeString().split(' ')[0];

    const serviciosNombres = servicios1
      .filter(s => servSeleccionados[s.id])
      .map(s => s.nombre);

    if (diagnostico) {
      serviciosNombres.push('Diagnóstico');
    }

    const objetoCita = {
      fecha: fechaStr,
      hora: horaStr,
      marca,
      modelo,
      servicios: serviciosNombres,
    };

    try {
      const respuesta = await createAppointment(objetoCita);
      console.log('Cita creada correctamente:', respuesta);
      toast.success('Cita creada con éxito.');
      resetFormulario();

      setTimeout(() => {
        navigate('/consultacita');
      }, 5000);
    } catch (error) {
      console.error('Error al crear la cita:', error);
      toast.error('No se pudo crear la cita, intenta nuevamente.');
    }

  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs paths={breadcrumbPaths} />

      <form onSubmit={manejarEnviar} className="form-card p-6 max-w-6xl mx-auto">
        <h2 className="form-title mb-6">Solicitar Cita</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="marca" className="form-label">Marca del Auto</label>
                <select
                  id="marca"
                  value={marca}
                  onChange={e => { setMarca(e.target.value); setModelo(''); }}
                  className="form-input"
                  required
                >
                  <option value="">Seleccione una marca</option>
                  {marcasUnicas.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {marca && (
                <div className="form-group">
                  <label htmlFor="modelo" className="form-label">Modelo del Auto</label>
                  <select
                    id="modelo"
                    value={modelo}
                    onChange={e => setModelo(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Seleccione un modelo</option>
                    {modelosFiltrados.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fecha" className="form-label">Fecha y Hora Preferida</label>
                <input
                  type="datetime-local"
                  id="fecha"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded space-y-2">
              <h3 className="font-semibold">Resumen</h3>
              <p><strong>Marca:</strong> {marca || '—'}</p>
              <p><strong>Modelo:</strong> {modelo || '—'}</p>
              <p><strong>Fecha:</strong> {fecha ? new Date(fecha).toLocaleString() : '—'}</p>
              <p><strong>Diagnóstico:</strong> {diagnostico ? 'Sí' : 'No'}</p>
              <div>
                <strong>Servicios:</strong>
                {seleccionados.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {seleccionados.map(srv => <li key={srv.id}>{srv.nombre}</li>)}
                  </ul>
                ) : <span> Ninguno</span>}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-aceptar flex-1">Solicitar Cita</button>
              <button
                type="button"
                className="btn-cancelar flex-1"
                onClick={() => navigate('/consultacita')}
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="form-group flex items-center space-x-2">
              <input
                type="checkbox"
                id="diagnostico"
                checked={diagnostico}
                onChange={() => setDiagnostico(prev => !prev)}
                className="form-checkbox w-5 h-5"
              />
              <label htmlFor="diagnostico" className="form-label text-xl">Diagnóstico</label>
            </div>

            <button
              type="button"
              onClick={() => setMostrarServicios(!mostrarServicios)}
              className="button-yellow"
            >
              {mostrarServicios ? 'Ocultar Servicios' : 'Seleccionar Servicios'}
            </button>

            {mostrarServicios && (
              <div className="space-y-3 mt-4">
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  value={busquedaServ}
                  onChange={e => setBusquedaServ(e.target.value)}
                  className="form-input"
                />
                {servFiltrados.map(srv => (
                  <label key={srv.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!servSeleccionados[srv.id]}
                      onChange={() => {
                        setServSeleccionados(prev => {
                          const next = { ...prev };
                          if (next[srv.id]) delete next[srv.id];
                          else next[srv.id] = true;
                          return next;
                        });
                      }}
                      className="form-checkbox"
                    />
                    <span>{srv.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default AgregarCita;
