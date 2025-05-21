import React, { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';

function AgregarCita() {
  const [fecha, setFecha] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [comentario, setComentario] = useState('');
  const [diagnostico, setDiagnostico] = useState(false);
  const [servSeleccionados, setServSeleccionados] = useState({});
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [busquedaServ, setBusquedaServ] = useState('');

  const autos = [
    { marca: 'BMW', modelos: ['X3', 'M3'] },
    { marca: 'Ford', modelos: ['Focus'] },
  ];

  const servicios = [
    { nombre: 'Cambio de Aceite', clave: 'cambioAceite' },
    { nombre: 'Revisión General', clave: 'revisionGeneral' },
    { nombre: 'Reparación de Frenos', clave: 'reparacionFrenos' },
    { nombre: 'Alineación de Ruedas', clave: 'alineacionRuedas' },
  ];

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta Cita', link: '/consultacita' },
    { name: 'Solicitar Cita', link: '/agregarCita' },
  ];

  const manejarFechaChange = e => setFecha(e.target.value);
  const manejarMarcaChange = e => { setMarca(e.target.value); setModelo(''); };
  const manejarModeloChange = e => setModelo(e.target.value);
  const manejarComentarioChange = e => setComentario(e.target.value);
  const manejarDiagnosticoToggle = () => setDiagnostico(prev => !prev);
  const manejarServToggle = clave => {
    setServSeleccionados(prev => {
      const next = { ...prev };
      if (next[clave]) delete next[clave];
      else next[clave] = true;
      return next;
    });
  };
  const manejarEnviar = e => {
    e.preventDefault();
    console.log({ fecha, marca, modelo, comentario, diagnostico, servicios: Object.keys(servSeleccionados) });
  };

  const servFiltrados = servicios.filter(s => s.nombre.toLowerCase().includes(busquedaServ.toLowerCase()));
  const seleccionados = servicios.filter(s => servSeleccionados[s.clave]);

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs paths={breadcrumbPaths} />

      <form onSubmit={manejarEnviar} className="form-card p-6 max-w-6xl mx-auto">
        <h2 className="form-title mb-6">Solicitar Cita</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* IZQUIERDA: Inputs, resumen y botones */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="marca" className="form-label">Marca del Auto</label>
                <select id="marca" value={marca} onChange={manejarMarcaChange} className="form-input" required>
                  <option value="">Seleccione una marca</option>
                  {autos.map(a => <option key={a.marca} value={a.marca}>{a.marca}</option>)}
                </select>
              </div>

              {marca && (
                <div className="form-group">
                  <label htmlFor="modelo" className="form-label">Modelo del Auto</label>
                  <select id="modelo" value={modelo} onChange={manejarModeloChange} className="form-input" required>
                    <option value="">Seleccione un modelo</option>
                    {autos.find(a => a.marca === marca)?.modelos.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fecha" className="form-label">Fecha y Hora Preferida</label>
                <input type="datetime-local" id="fecha" value={fecha} onChange={manejarFechaChange} className="form-input" required />
              </div>

              <div className="form-group">
                <label htmlFor="comentario" className="form-label">Comentario (Opcional)</label>
                <textarea id="comentario" value={comentario} onChange={manejarComentarioChange} className="form-input" placeholder="Agrega un comentario" />
              </div>
            </div>

            {/* Resumen */}
            <div className="p-4 bg-gray-50 rounded space-y-2">
              <h3 className="font-semibold">Resumen</h3>
              <p><strong>Marca:</strong> {marca || '—'}</p>
              <p><strong>Modelo:</strong> {modelo || '—'}</p>
              <p><strong>Fecha:</strong> {fecha ? new Date(fecha).toLocaleString() : '—'}</p>
              <p><strong>Comentario:</strong> {comentario || '—'}</p>
              <p><strong>Diagnóstico:</strong> {diagnostico ? 'Sí' : 'No'}</p>
              <div>
                <strong>Servicios:</strong>
                {seleccionados.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {seleccionados.map(srv => <li key={srv.clave}>{srv.nombre}</li>)}
                  </ul>
                ) : <span> Ninguno</span>}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button type="submit" className="btn-aceptar flex-1">Solicitar Cita</button>
              <button type="button" className="btn-cancelar flex-1" onClick={() => window.location.reload()}>Cancelar</button>
            </div>
          </div>

          {/* DERECHA: diagnóstico y servicios */}
          <div className="space-y-6">
            <div className="form-group flex items-center space-x-2">
              <input type="checkbox" id="diagnostico" checked={diagnostico} onChange={manejarDiagnosticoToggle} className="form-checkbox w-5 h-5" />
              <label htmlFor="diagnostico" className="form-label text-xl">Diagnóstico</label>
            </div>

            <button type="button" onClick={() => setMostrarServicios(!mostrarServicios)} className="button-yellow">
              {mostrarServicios ? 'Ocultar Servicios' : 'Seleccionar Servicios'}
            </button>

            {mostrarServicios && (
              <div className="space-y-3 mt-4">
                <input type="text" placeholder="Buscar servicio..." value={busquedaServ} onChange={e => setBusquedaServ(e.target.value)} className="form-input" />
                {servFiltrados.map(srv => (
                  <label key={srv.clave} className="flex items-center space-x-2">
                    <input type="checkbox" checked={!!servSeleccionados[srv.clave]} onChange={() => manejarServToggle(srv.clave)} className="form-checkbox" />
                    <span>{srv.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AgregarCita;

