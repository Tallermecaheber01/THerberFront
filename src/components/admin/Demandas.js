import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import datos from './datos.json';

// Registro de módulos y plugin de datalabels
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Redondeo personalizado
function customRound(num) {
  const intPart = Math.floor(num);
  return (num - intPart > 0.5) ? Math.ceil(num) : intPart;
}

// Valores semanales para cada servicio
const serviceWeeklyValues = {
  'Reparación de frenos': [12, 11, 13, 10],
  'Cambio de aceite': [10, 9, 12, 12],
  'Alineación y balanceo': [6, 7, 8, 8],
  'Cambio de neumáticos': [4, 5, 5, 6],
  'Revisión de motor': [4, 5, 6, 6],
  'Diagnóstico general': [10, 11, 12, 13]
};

// Auxiliar para parsear fecha "YYYY-MM-DD" como local, evitando offsets
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Suma días a un Date (modo local)
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// Suma meses a un Date (modo local)
function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

// Formatear fecha en español
function formatDate(date) {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getWeeklyValue(serviceName, week) {
  const values = serviceWeeklyValues[serviceName];
  if (!values) return null;
  return values[Math.min(week, values.length - 1)];
}

// Arreglo de servicios con insumos
const services = Object.keys(serviceWeeklyValues).map(name => {
  let insumos = [];
  switch(name) {
    case 'Reparación de frenos':
      insumos = [
        { nombre: 'Pastillas de freno', cantidadPorServicio: 2 },
        { nombre: 'Líquido de frenos (L)', cantidadPorServicio: 0.5 }
      ];
      break;
    case 'Cambio de aceite':
      insumos = [
        { nombre: 'Aceite (L)', cantidadPorServicio: 3 },
        { nombre: 'Filtro de aceite', cantidadPorServicio: 1 }
      ];
      break;
    case 'Alineación y balanceo':
      insumos = [{ nombre: 'Plomos de balanceo', cantidadPorServicio: 4 }];
      break;
    case 'Cambio de neumáticos':
      insumos = [{ nombre: 'Neumático', cantidadPorServicio: 1 }];
      break;
    case 'Revisión de motor':
      insumos = [{ nombre: 'Filtro de aire', cantidadPorServicio: 1 }];
      break;
    case 'Diagnóstico general':
      insumos = [{ nombre: 'Equipo de diagnóstico', cantidadPorServicio: 1 }];
      break;
    default:
      break;
  }
  return {
    nombre: name,
    demandaInicial: serviceWeeklyValues[name][0],
    demandaEnT: serviceWeeklyValues[name][3],
    diaInicial: 0,
    diaT: 3,
    insumos
  };
});

// Card de selección
function ServiceSelectCard({ servicios, selected, onSelect, onCalculate, startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <div className="service-card flex-1 min-w-[400px] p-4">
      <h3 className="service-card-title text-yellow-400">Seleccione un Servicio</h3>
      <select
        value={selected ? selected.nombre : ''}
        onChange={(e) => {
          const service = servicios.find(s => s.nombre === e.target.value);
          onSelect(service);
        }}
        className="form-input"
      >
        <option value="" disabled>
          -- Seleccione un servicio --
        </option>
        {servicios.map((srv) => (
          <option key={srv.nombre} value={srv.nombre}>
            {srv.nombre}
          </option>
        ))}
      </select>
      {/* Inputs de fechas */}
      <div className="mt-4">
        <label className="text-yellow-400 block mb-1">Fecha de inicio:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="mt-4">
        <label className="text-yellow-400 block mb-1">Fecha fin:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="form-input"
        />
      </div>
      {selected && (
        <button className="btn-aceptar mt-2" onClick={onCalculate}>
          Calcular demanda
        </button>
      )}
    </div>
  );
}

// Card de Resumen de Datos (todos los cards usan la misma clase "service-card")
// Los labels usan "text-yellow-400" y el contenido permanece en blanco.
function SummaryCard({ servicio, startDate, endDate, daysDiff }) {
  if (!servicio || !startDate || !endDate || daysDiff === null) return null;

  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  const demandaInicio = getWeeklyValue(servicio.nombre, 0);
  const chosenWeek = Math.floor(daysDiff / 7);
  const demandaSegunda = getWeeklyValue(servicio.nombre, chosenWeek);

  return (
    <div className="service-card p-4 flex-1 min-w-[200px] bg-gray-700 text-white">
      <h4 className="font-bold mb-2">Resumen de Datos</h4>
      <p>
        <span className="text-yellow-400">Semana inicio:</span> {formatDate(start)}
      </p>
      <p>
        <span className="text-yellow-400">Demanda:</span> {demandaInicio}
      </p>
      <hr className="my-2" />
      <p>
        <span className="text-yellow-400">Semana Fin:</span> {formatDate(end)}
      </p>
      <p>
        <span className="text-yellow-400">Demanda:</span> {demandaSegunda}
      </p>
    </div>
  );
}

// Tabla de Predicciones (semana 8 y 12)
// El encabezado tendrá fondo verde con texto blanco y en las filas se muestra el texto adicional.
function ResultsCardDaily({ servicio, daysDiff, endDate, startDate }) {
  if (daysDiff === null) return null;

  const weeklyArray = serviceWeeklyValues[servicio.nombre];
  if (!weeklyArray) return null;
  
  const fixedWeek0 = weeklyArray[0];
  const chosenWeek = Math.floor(daysDiff / 7);
  const fixedChosenWeek = weeklyArray[Math.min(chosenWeek, weeklyArray.length - 1)];
  const k = chosenWeek === 0 ? 0 : Math.log(fixedChosenWeek / fixedWeek0) / chosenWeek;
  
  const finalWeeks = [7, 11];
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  const weeklyResults = finalWeeks.map(weekOffset => {
    const value = fixedWeek0 * Math.exp(k * weekOffset);
    let dateLabel = "";
    let monthLabel = "";
    if (weekOffset === 7) {
      dateLabel = formatDate(addMonths(end, 1));
      monthLabel = "(mes 2)";
    } else if (weekOffset === 11) {
      dateLabel = formatDate(addMonths(end, 2));
      monthLabel = "(mes 3)";
    }
    return { dateLabel, monthLabel, demand: customRound(value) };
  });
  
  const headerTitle = servicio.nombre === "Reparación de frenos"
    ? "Predicciones"
    : `Resultados para: ${servicio.nombre}`;
  
  return (
    <div className="service-card w-full mt-5 overflow-x-auto p-4 flex flex-col md:flex-row gap-4">
      <SummaryCard servicio={servicio} startDate={startDate} endDate={endDate} daysDiff={daysDiff} />
      <div className="flex-1">
        <h3 className="text-yellow-400 mb-4">{headerTitle}</h3>
        <table className="w-full border-collapse mt-2 text-white">
          <thead>
            <tr className="bg-green-600 dark:bg-green-500 text-white">
              <th className="border border-white p-2 font-bold">Predicción</th>
              <th className="border border-white p-2 font-bold">Servicios Solicitados</th>
            </tr>
          </thead>
          <tbody>
            {weeklyResults.map((result, idx) => (
              <tr key={idx} className="text-white">
                <td className="border border-white p-2">
                  {result.dateLabel}<br />
                  <small>{result.monthLabel}</small>
                </td>
                <td className="border border-white p-2">{result.demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Opciones para las gráficas
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', labels: { color: 'white' } },
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: (value) => value,
      font: { weight: 'bold' },
      color: 'white'
    }
  },
  scales: {
    x: {
      title: { display: true, text: 'Semanas / Predicción', color: 'white' },
      ticks: { color: 'white' },
      grid: { color: 'rgba(255,255,255,0.2)' }
    },
    y: {
      title: { display: true, text: 'Cantidad', color: 'white' },
      ticks: { color: 'white' },
      grid: { color: 'rgba(255,255,255,0.2)' }
    }
  }
};

export default function App() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartData2Weeks, setChartData2Weeks] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysDiff, setDaysDiff] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [trendMessage, setTrendMessage] = useState("");

  const [visibleWeeks, setVisibleWeeks] = useState(1);
  const largeChartStyle = "w-[500px] h-[500px]";
  const smallCardStyle = "service-card p-4 text-white min-w-[200px]";

  // Restricción: solo se permiten fechas entre el 03/03/2025 y el 27/03/2025
  const allowedStart = "2025-03-03";
  const allowedEnd = "2025-03-27";

  const handleStartDateChange = (value) => {
    if (value < allowedStart || value > allowedEnd) {
      toast.error("La fecha de inicio debe estar entre el 03/03/2025 y el 27/03/2025", {
        style: { color: "white", backgroundColor: "black" }
      });
      return;
    }
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    if (value < allowedStart || value > allowedEnd) {
      toast.error("La fecha de fin debe estar entre el 03/03/2025 y el 27/03/2025", {
        style: { color: "white", backgroundColor: "black" }
      });
      return;
    }
    if (startDate && value < startDate) {
      toast.error("La fecha de fin no puede ser anterior a la fecha de inicio", {
        style: { color: "white", backgroundColor: "black" }
      });
      return;
    }
    setEndDate(value);
  };

  const handleCalculate = () => {
    if (!servicioSeleccionado) return;
    
    let diffDaysLocal = null;
    if (startDate && endDate) {
      const diffTime = parseLocalDate(endDate) - parseLocalDate(startDate);
      diffDaysLocal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysDiff(diffDaysLocal);
  
      const start = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      const filtered = datos
        .filter(semana => {
          const weekStart = parseLocalDate(semana.fechas.inicio);
          const weekEnd = parseLocalDate(semana.fechas.fin);
          return (weekEnd >= start && weekStart <= end);
        })
        .map(semana => ({
          ...semana,
          servicios: semana.servicios.filter(registro => registro.servicio === servicioSeleccionado.nombre)
        }))
        .filter(semana => semana.servicios.length > 0);
      
      setFilteredData(filtered);
      setVisibleWeeks(1);
    } else {
      setDaysDiff(null);
      setFilteredData([]);
      setVisibleWeeks(1);
    }
  
    const weeklyArray = serviceWeeklyValues[servicioSeleccionado.nombre];
    const fixedWeek0 = weeklyArray[0];
    const chosenWeek = diffDaysLocal !== null ? Math.floor(diffDaysLocal / 7) : 0;
    const fixedChosenWeek = weeklyArray[Math.min(chosenWeek, weeklyArray.length - 1)];
    const k = chosenWeek === 0 ? 0 : Math.log(fixedChosenWeek / fixedWeek0) / chosenWeek;
  
    const weeks = [0, 1, 2, 3, 7, 11];
    const tableResults = weeks.map(week => {
      const rawDemand = fixedWeek0 * Math.exp(k * week);
      return { week, demand: customRound(rawDemand) };
    });
  
    const diffs = [];
    for (let i = 1; i < tableResults.length; i++) {
      diffs.push(tableResults[i].demand - tableResults[i - 1].demand);
    }
    if (diffs.every(d => d >= 0)) {
      setTrendMessage("En general, la demanda creció.");
    } else if (diffs.every(d => d <= 0)) {
      setTrendMessage("En general, la demanda decreció.");
    } else {
      setTrendMessage("La tendencia de la demanda fue mixta.");
    }
  
    setResultados(tableResults);
    setChartData(null);
    setChartData2Weeks(null);
  };
  
  
  // Primera gráfica: solo la barra de la semana 8 en rojo, el resto en azul.
  const handleGraph = () => {
    if (!resultados.length) return;

    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    const labels = resultados.map(row => {
      if (row.week >= 0 && row.week <= 3 && startDate) {
        const d = addDays(start, row.week * 7);
        return formatDate(d);
      }
      if (row.week === 7 && endDate) {
        const d = addMonths(end, 1);
        return formatDate(d);
      }
      if (row.week === 11 && endDate) {
        const d = addMonths(end, 2);
        return formatDate(d);
      }
      return `Semana ${row.week + 1}`;
    });
    
    const colors = resultados.map(row => {
      if (row.week === 7 || row.week === 11) return 'rgba(15, 157, 56, 0.8)'; // solo semana 8 en rojo
      return 'rgba(66,165,245,0.8)'; // el resto (incluida la semana 12) en azul
    });
    
    const demandData = resultados.map(row => row.demand);
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Servicios Demandados',
          data: demandData,
          backgroundColor: colors
        }
      ]
    };
    setChartData(data);
  };

  // Segunda gráfica: demanda a 12 semanas para todos los servicios
  const handleGraphWeek12 = () => {
    if (!daysDiff) {
      toast.error("Seleccione las fechas para calcular la demanda", {
        style: { color: "white", backgroundColor: "black" }
      });
      return;
    }
    const chosenWeek = Math.floor(daysDiff / 7);
    const labels = services.map(s => s.nombre);
    const dataValues = services.map(s => {
      const weeklyArray = serviceWeeklyValues[s.nombre];
      const fixedWeek0 = weeklyArray[0];
      const fixedChosenWeek = weeklyArray[Math.min(chosenWeek, weeklyArray.length - 1)];
      const k = chosenWeek === 0 ? 0 : Math.log(fixedChosenWeek / fixedWeek0) / chosenWeek;
      const demandWeek12 = fixedWeek0 * Math.exp(k * 11);
      return customRound(demandWeek12);
    });
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Demanda a 12 semanas',
          data: dataValues,
          backgroundColor: [
            'rgba(99, 179, 92, 0.8)',
            'rgba(245, 130, 32, 0.8)',
            'rgba(66,165,245,0.8)',
            'rgba(156,39,176,0.8)',
            'rgba(233,30,99,0.8)',
            'rgba(25,124,114,0.8)'
          ]
        }
      ]
    };
    setChartData2Weeks(data);
  };

  const sortedServices = () => {
    if (!chartData2Weeks) return [];
    const combined = chartData2Weeks.labels.map((name, i) => ({
      name,
      demand: chartData2Weeks.datasets[0].data[i]
    }));
    return combined.sort((a, b) => b.demand - a.demand);
  };

  const renderFilteredTable = () => {
    if (!filteredData.length) return null;

    const showMore = visibleWeeks < filteredData.length;
    const showLess = visibleWeeks > 1;

    return (
      <div className="service-card w-full mt-5 overflow-x-auto p-4 text-white">
        <h2 className="service-card-title text-yellow-400 mb-4 text-center">
          Registro reparaciones en el mes de marzo
        </h2>
        <table className="w-full border-collapse" style={{ border: '1px solid white' }}>
          <thead>
            <tr className="bg-green-600 dark:bg-green-500 text-white">
              <th className="border border-white p-2 font-bold">Semana</th>
              <th className="border border-white p-2 font-bold">Servicio</th>
              <th className="border border-white p-2 font-bold">Cliente</th>
              <th className="border border-white p-2 font-bold">Fecha Ingreso</th>
              <th className="border border-white p-2 font-bold">Fecha Salida</th>
              <th className="border border-white p-2 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, visibleWeeks).map((semana, idx) =>
              semana.servicios.map((registro, i) => (
                <tr key={`${semana.week}-${idx}-${i}`} className="text-white">
                  <td className="border border-white p-2">{semana.week}</td>
                  <td className="border border-white p-2">{registro.servicio}</td>
                  <td className="border border-white p-2">{registro.cliente}</td>
                  <td className="border border-white p-2">{registro.fechaIngreso}</td>
                  <td className="border border-white p-2">{registro.fechaSalida}</td>
                  <td className="border border-white p-2">{registro.Total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex gap-4 mt-3 justify-center">
          {showMore && (
            <button className="btn-blue" onClick={() => setVisibleWeeks(prev => prev + 1)}>
              Ver más
            </button>
          )}
          {showLess && (
            <button className="btn-aceptar" onClick={() => setVisibleWeeks(prev => prev - 1)}>
              Ver menos
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1100px] mx-auto p-40 font-sans bg-fondoClaro dark:bg-fondoObscuro">
      <h1 className="text-center navbar-title text-yellow-400">Demanda de servicios</h1>
      {/* Selección de servicio y fechas */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mt-4">
        <div className="w-full">
          <ServiceSelectCard
            servicios={services}
            selected={servicioSeleccionado}
            onSelect={(servicio) => {
              setServicioSeleccionado(servicio);
              setResultados([]);
              setChartData(null);
              setChartData2Weeks(null);
              setTrendMessage("");
            }}
            onCalculate={handleCalculate}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>
      {/* Tabla filtrada con paginación */}
      {renderFilteredTable()}
      {/* Sección de botones y gráficas en línea */}
      <div className="mt-5 flex flex-col items-center">
        {/* Botones, lado a lado */}
        <div className="flex flex-row gap-4">
          <button className="btn-aceptar" onClick={handleGraph}>
            Graficar evolución completa
          </button>
          <button className="btn-blue" onClick={handleGraphWeek12}>
            Graficar demanda 12 semanas de los servicios
          </button>
        </div>
        {/* Gráficas, lado a lado */}
        <div className="mt-5 flex flex-row gap-4">
          {chartData && (
            <div className={largeChartStyle}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
          {chartData2Weeks && (
            <div className={largeChartStyle}>
              <Bar data={chartData2Weeks} options={chartOptions} />
            </div>
          )}
        </div>
        {/* Cards de Tendencia Global y Ranking de Servicios */}
        <div className="mt-5 flex flex-row gap-4">
          {chartData && (
            <div className={smallCardStyle}>
              <h4 className="font-bold mb-2">Tendencia Global</h4>
              <p>{trendMessage}</p>
            </div>
          )}
          {chartData2Weeks && (
            <div className={smallCardStyle}>
              <h4 className="font-bold mb-2">Ranking de Servicios</h4>
              <ol>
                {sortedServices().map((item, index) => (
                  <li key={index}>
                    {index + 1}. {item.name}: <span className="text-green-500">{item.demand}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
              {/* Tabla de Predicciones (semana 8 y 12) */}
        {resultados.length > 0 && servicioSeleccionado && (
          <ResultsCardDaily
            servicio={servicioSeleccionado}
            daysDiff={daysDiff}
            endDate={endDate}
            startDate={startDate}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}