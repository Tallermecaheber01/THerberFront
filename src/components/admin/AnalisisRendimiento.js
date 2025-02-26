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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ReportComponent = () => {
  const mockData = [
    {
      cliente: 'Juan',
      tipoServicio: 'Mantenimiento',
      mes: 'Enero',
      rendimiento: 90,
    },
    {
      cliente: 'Maria',
      tipoServicio: 'Reparación',
      mes: 'Febrero',
      rendimiento: 70,
    },
    {
      cliente: 'Lucas',
      tipoServicio: 'Diagnóstico',
      mes: 'Marzo',
      rendimiento: 85,
    },
    {
      cliente: 'Juan',
      tipoServicio: 'Mantenimiento',
      mes: 'Abril',
      rendimiento: 95,
    },
    {
      cliente: 'Maria',
      tipoServicio: 'Reparación',
      mes: 'Mayo',
      rendimiento: 80,
    },
  ];

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
  const servicios = ['Mantenimiento', 'Reparación', 'Diagnóstico'];
  const clientes = ['Juan', 'Maria', 'Lucas'];

  const [filtroMes, setFiltroMes] = useState('Todos');
  const [filtroServicio, setFiltroServicio] = useState('Todos');
  const [filtroCliente, setFiltroCliente] = useState('Todos');
  const [filtrados, setFiltrados] = useState(mockData);

  useEffect(() => {
    let datos = mockData;

    if (filtroMes !== 'Todos') {
      datos = datos.filter((item) => item.mes === filtroMes);
    }

    if (filtroServicio !== 'Todos') {
      datos = datos.filter((item) => item.tipoServicio === filtroServicio);
    }

    if (filtroCliente !== 'Todos') {
      datos = datos.filter((item) => item.cliente === filtroCliente);
    }

    setFiltrados(datos);
  }, [filtroMes, filtroServicio, filtroCliente]);

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Rendimiento');
    XLSX.writeFile(wb, 'reporte_rendimiento.xlsx');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Rendimiento del Taller', 20, 20);
    doc.autoTable({
      head: [['Cliente', 'Tipo de Servicio', 'Mes', 'Rendimiento']],
      body: filtrados.map((item) => [
        item.cliente,
        item.tipoServicio,
        item.mes,
        item.rendimiento,
      ]),
      startY: 30,
    });
    doc.save('reporte_rendimiento.pdf');
  };

  const chartData = {
    labels: filtrados.map((item) => item.mes),
    datasets: [
      {
        label: 'Rendimiento (%)',
        data: filtrados.map((item) => item.rendimiento),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Reporte de Rendimiento del Taller' },
    },
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">
        Reporte de Rendimiento del Taller
      </h1>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-yellow-400">Filtrar por Mes</label>
          <select
            className="form-input"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {meses.map((mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-yellow-400">
            Filtrar por Tipo de Servicio
          </label>
          <select
            className="form-input"
            value={filtroServicio}
            onChange={(e) => setFiltroServicio(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {servicios.map((servicio) => (
              <option key={servicio} value={servicio}>
                {servicio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-yellow-400">Filtrar por Cliente</label>
          <select
            className="form-input"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {clientes.map((cliente) => (
              <option key={cliente} value={cliente}>
                {cliente}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <button onClick={downloadExcel} className="button-yellow">
          Descargar Reporte en Excel
        </button>
        <button onClick={downloadPDF} className="btn-blue">
          Descargar Reporte en PDF
        </button>
      </div>

      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        {filtrados.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p className="text-gray-400">No hay datos para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default ReportComponent;
