import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getAllClientProfiles } from '../../api/client';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

const metricas = ['citas', 'servicios', 'promedio', 'gastoTotal'];

const ClientInsights = () => {
  const [clientes, setClientes] = useState([]);
  const [grafPerfil, setGrafPerfil] = useState('Todos');
  const [grafMetrica, setGrafMetrica] = useState('citas');
  const [detalle, setDetalle] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSel, setClienteSel] = useState(null);
  const [cardNombreFilter, setCardNombreFilter] = useState('');
  const [cardPerfilFilter, setCardPerfilFilter] = useState('Todos');
  const [cardSel, setCardSel] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getAllClientProfiles();
        const response = await fetch('https://clustering-yfq7.onrender.com/clasificar-lote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            data.map(c => ({
              idCliente: c.idCliente,
              total_citas: Number(c.totalCitas),
              total_servicios: Number(c.totalServicios),
              gasto_total: Number(c.gastoTotal),
              gasto_promedio: Number(c.gastoPromedio),
            }))
          ),
        });
        const result = await response.json();
        const preparados = data.map(c => {
          const etiqueta = result.find(r => r.idCliente === c.idCliente)?.perfil || 'Desconocido';
          return {
            id: c.idCliente,
            nombre: c.nombre,
            apellidoPaterno: c.apellidoPaterno,
            apellidoMaterno: c.apellidoMaterno,
            citas: Number(c.totalCitas),
            servicios: Number(c.totalServicios),
            gastoTotal: Number(c.gastoTotal),
            promedio: Number(c.gastoPromedio),
            perfil: etiqueta,
          };
        });
        setClientes(preparados);
      } catch (error) {
        console.error('Error cargando perfiles de cliente:', error);
      }
    };
    fetchClientes();
  }, []);

  const perfiles = ['Todos', ...new Set(clientes.map(c => c.perfil))];
  const datosGraf = clientes.filter(c => grafPerfil === 'Todos' || c.perfil === grafPerfil);

  const labelsGraf = detalle && clienteSel
    ? ['Citas', 'Servicios', 'Promedio', 'Gasto Total']
    : datosGraf.map(c => `${c.nombre} ${c.apellidoPaterno}`);
  const dataGraf = detalle && clienteSel
    ? [clienteSel.citas, clienteSel.servicios, clienteSel.promedio, clienteSel.gastoTotal]
    : datosGraf.map(c => c[grafMetrica]);

  const backgroundColors = labelsGraf.map((_, i) => `hsla(${(i * 360) / labelsGraf.length}, 50%, 35%, 0.6)`);
  const borderColors = labelsGraf.map((_, i) => `hsla(${(i * 360) / labelsGraf.length}, 50%, 35%, 1)`);

  const chartData = {
    labels: labelsGraf,
    datasets: [{
      label: detalle && clienteSel ? 'Detalle Cliente' : `Distribución ${grafMetrica}`,
      data: dataGraf,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
    }],
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartOptions = {
    responsive: true,
    layout: { padding: { top: 100 } },
    plugins: {
      datalabels: {
        color: isDark ? '#fff' : '#000',
        anchor: 'end',
        align: 'start',
      },
    },
  };

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.text('Análisis Estratégico de Clientes', 20, 20);
    doc.autoTable({
      head: [['Cliente', 'Tipo', 'Citas', 'Servicios', 'Promedio', 'Gasto Total']],
      body: clientes.map(c => [
        `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`,
        c.perfil,
        c.citas,
        c.servicios,
        c.promedio,
        c.gastoTotal
      ]),
      startY: 30,
    });
    doc.save('perfil_clientes.pdf');
  };

  const descargarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      clientes.map(c => ({
        Nombre: `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`,
        Tipo: c.perfil,
        Citas: c.citas,
        Servicios: c.servicios,
        Promedio: c.promedio,
        GastoTotal: c.gastoTotal,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, 'perfil_clientes.xlsx');
  };

  const filteredCards = clientes.filter(c =>
    (cardNombreFilter === '' || `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`.toLowerCase().includes(cardNombreFilter.toLowerCase())) &&
    (cardPerfilFilter === 'Todos' || c.perfil === cardPerfilFilter)
  );

  return (
    <div className="p-6 pt-20 bg-fondoClaro dark:bg-fondoObscuro rounded-lg shadow-lg">
      <h1 className="form-title text-center mb-6">Análisis Estratégico de Clientes</h1>
      <div className="service-card p-6 bg-cardClaro dark:bg-cardObscuro mb-6 relative">
        {!detalle && (
          <div className="absolute top-4 right-4 flex flex-col md:flex-row gap-4">
            <select value={grafPerfil} onChange={e => setGrafPerfil(e.target.value)} className="form-input">
              {perfiles.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={grafMetrica} onChange={e => setGrafMetrica(e.target.value)} className="form-input">
              {metricas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={detalle} onChange={e => setDetalle(e.target.checked)} id="detalle" className="w-12 h-12" />
              <label htmlFor="detalle" className="form-label mb-0">Filtrar por cliente</label>
            </div>
          </div>
        )}
        {detalle && (
          <div className="absolute top-4 right-4">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Escribe nombre y presiona Enter"
              className="form-input"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const sel = clientes.find(c => `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`.toLowerCase() === busqueda.toLowerCase());
                  setClienteSel(sel || null);
                }
              }}
            />
            <button onClick={() => setDetalle(false)} className="mt-2 btn-cancelar">Cancelar filtro</button>
          </div>
        )}
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button onClick={descargarExcel} className="btn-aceptar flex-1">Descargar Excel</button>
        <button onClick={descargarPDF} className="btn-cancelar flex-1">Descargar PDF</button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar Nombre"
          value={cardNombreFilter}
          onChange={e => setCardNombreFilter(e.target.value)}
          className="form-input flex-1"
        />
        <select
          value={cardPerfilFilter}
          onChange={e => setCardPerfilFilter(e.target.value)}
          className="form-input w-1/3"
        >
          {perfiles.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map(c => {
          const selected = cardSel === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setCardSel(selected ? null : c.id)}
              className={`service-card card-transition p-6 bg-cardClaro dark:bg-cardObscuro ${selected ? 'scale-105 z-10' : ''}`}
            >
              <h3 className="service-card-title">{`${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`}</h3>
              <p className="service-card-subtitle text-sm text-gray-600 dark:text-gray-300">Tipo de cliente: <span className="font-semibold">{c.perfil}</span></p>
              <p className="service-card-text">Citas: {c.citas}</p>
              <p className="service-card-text">Servicios: {c.servicios}</p>
              <p className="service-card-text">Promedio gastos: ${c.promedio}</p>
              <p className="service-card-text">Gasto Total: ${c.gastoTotal}</p>
              {selected && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-opacity-20">
                  <h4 className="text-base font-bold text-[#F0AD38] mb-2">Sugerencia:</h4>
                <p className="service-card-text">
                {c.perfil === 'Cliente esporádico' &&
                    'Aprovecha su retorno con un cupón exclusivo y seguimiento por WhatsApp para agendar su próxima visita.'}

                {c.perfil === 'Cliente ocasional' &&
                    'Promueve un paquete de mantenimiento anticipado con beneficios si agenda en los próximos 15 días.'}

                {c.perfil === 'Cliente regular' &&
                    'Refuerza la fidelidad con recordatorios personalizados y una tarjeta de puntos por cada servicio realizado.'}

                {c.perfil === 'Cliente frecuente' &&
                    'Invítalo a un programa VIP: acceso prioritario, mantenimiento preferencial y descuentos en servicios premium.'}
                </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientInsights;

