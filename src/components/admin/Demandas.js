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

// Registro de módulos y plugin de datalabels
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Redondeo personalizado: si la parte decimal es > 0.5 redondea hacia arriba; si es <= 0.5 redondea hacia abajo.
function customRound(num) {
  const intPart = Math.floor(num);
  return (num - intPart > 0.5) ? Math.ceil(num) : intPart;
}

// Card de selección: incluye el <select> y un botón para calcular la demanda del servicio seleccionado.
function ServiceSelectCard({ servicios, selected, onSelect, onCalculate }) {
  return (
    <div className="service-card flex-1 min-w-[250px] p-4">
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
      {selected && (
        <button className="btn-aceptar mt-2" onClick={onCalculate}>
          Calcular demanda
        </button>
      )}
    </div>
  );
}

// Card de información: muestra la demanda inicial, la demanda en 5 días y los insumos.
function ServiceInfoCard({ servicio }) {
  return (
    <div className="service-card flex-1 min-w-[250px] p-4">
      <h3 className="service-card-title text-yellow-400">Información del Servicio</h3>
      <p className="service-card-text">
        <strong className="text-yellow-400">Demanda inicial:</strong>{' '}
        <span className="text-white">{servicio.demandaInicial}</span>
      </p>
      <p className="service-card-text">
        <strong className="text-yellow-400">Demanda en 5 días:</strong>{' '}
        <span className="text-white">{servicio.demandaEnT}</span>
      </p>
      <p className="service-card-text">
        <strong className="text-yellow-400">Insumos:</strong>{' '}
        <span className="text-white">
          {servicio.insumos.map((ins, i) => (
            <span key={i}>
              {ins.nombre} (x{ins.cantidadPorServicio}){' '}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}

// Card de Resultados: muestra la tabla con los días, la demanda, la variación y los insumos requeridos.
function ResultsCard({ servicio, resultados }) {
  if (!Array.isArray(resultados)) return null;
  return (
    <div className="service-card w-full mt-5 overflow-x-auto p-4">
      <h3 className="service-card-title">
        <span className="text-yellow-400">Resultados para: </span>
        <span className="text-white">{servicio.nombre}</span>
      </h3>
      <table className="w-full border-collapse mt-2">
        <thead>
          <tr className="bg-blue-600 dark:bg-blue-500">
            <th className="border border-white p-2 text-white font-bold">Día</th>
            <th className="border border-white p-2 text-white font-bold">Servicios Solicitados</th>
            <th className="border border-white p-2 text-white font-bold">Variación</th>
            <th className="border border-white p-2 text-white font-bold">Insumos Requeridos</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map(result => {
            // Para el día 30 se usa un azul menos intenso.
            const rowClass = result.day === 30 ? "bg-blue-500 dark:bg-blue-400" : "";
            return (
              <tr key={result.day} className={rowClass}>
                <td className="border border-white p-2 text-white">{result.day}</td>
                <td className="border border-white p-2 text-white">{result.demand}</td>
                <td className="border border-white p-2 text-white">{result.variacion}</td>
                <td className="border border-white p-2 text-white">
                  {result.insumos.map((ins, idx) => (
                    <div key={idx}>
                      {ins.nombre}: {ins.total}
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Opciones de configuración para la gráfica, ajustando colores para un fondo azul oscuro.
const chartOptions = {
  responsive: true,
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
      title: { display: true, text: 'Días', color: 'white' },
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
  const servicios = [
    {
      nombre: 'Reparación de frenos',
      demandaInicial: 80,
      diaInicial: 1,
      demandaEnT: 60, // Dato específico para el día 5
      diaT: 5,
      insumos: [
        { nombre: 'Pastillas de freno', cantidadPorServicio: 2 },
        { nombre: 'Líquido de frenos (L)', cantidadPorServicio: 0.5 }
      ]
    },
    {
      nombre: 'Cambio de aceite',
      demandaInicial: 50,
      diaInicial: 1,
      demandaEnT: 30,
      diaT: 5,
      insumos: [
        { nombre: 'Aceite (L)', cantidadPorServicio: 3 },
        { nombre: 'Filtro de aceite', cantidadPorServicio: 1 }
      ]
    },
    {
      nombre: 'Alineación y balanceo',
      demandaInicial: 30,
      diaInicial: 1,
      demandaEnT: 18,
      diaT: 5,
      insumos: [{ nombre: 'Plomos de balanceo', cantidadPorServicio: 4 }]
    },
    {
      nombre: 'Cambio de neumáticos',
      demandaInicial: 60,
      diaInicial: 1,
      demandaEnT: 40,
      diaT: 5,
      insumos: [{ nombre: 'Neumático', cantidadPorServicio: 1 }]
    },
    {
      nombre: 'Revisión de motor',
      demandaInicial: 70,
      diaInicial: 1,
      demandaEnT: 50,
      diaT: 5,
      insumos: [{ nombre: 'Filtro de aire', cantidadPorServicio: 1 }]
    },
    {
      nombre: 'Sistema eléctrico',
      demandaInicial: 55,
      diaInicial: 1,
      demandaEnT: 35,
      diaT: 5,
      insumos: [{ nombre: 'Batería', cantidadPorServicio: 1 }]
    },
    {
      nombre: 'Frenos ABS',
      demandaInicial: 45,
      diaInicial: 1,
      demandaEnT: 28,
      diaT: 5,
      insumos: [
        { nombre: 'Sensor ABS', cantidadPorServicio: 1 },
        { nombre: 'Líquido de frenos (L)', cantidadPorServicio: 0.3 }
      ]
    },
    {
      nombre: 'Diagnóstico general',
      demandaInicial: 65,
      diaInicial: 1,
      demandaEnT: 42,
      diaT: 5,
      insumos: [{ nombre: 'Equipo de diagnóstico', cantidadPorServicio: 1 }]
    }
  ];

  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartDataAll, setChartDataAll] = useState(null);

  // Factor para el día 30 (usado en todos los gráficos)
  const predictionFactors = {
    10: 0.6,
    15: 0.5,
    20: 0.53,
    25: 0.475,
    30: 0.44
  };

  const handleCalculate = () => {
    if (!servicioSeleccionado) return;
    const initialDemand = servicioSeleccionado.demandaInicial;
    
    // Día 1: demanda inicial real
    const initialRow = {
      day: 1,
      demand: initialDemand,
      insumos: servicioSeleccionado.insumos.map(item => {
        const rawTotal = item.cantidadPorServicio * initialDemand;
        const total = item.nombre.toLowerCase().includes('(l)')
          ? rawTotal.toFixed(2)
          : customRound(rawTotal);
        return { nombre: item.nombre, total };
      })
    };

    // Día 5: demanda según dato proporcionado en el servicio
    const day5Row = {
      day: 5,
      demand: servicioSeleccionado.demandaEnT,
      insumos: servicioSeleccionado.insumos.map(item => {
        const rawTotal = item.cantidadPorServicio * servicioSeleccionado.demandaEnT;
        const total = item.nombre.toLowerCase().includes('(l)')
          ? rawTotal.toFixed(2)
          : customRound(rawTotal);
        return { nombre: item.nombre, total };
      })
    };

    // Días 10, 15, 20, 25 y 30 calculados usando la demanda inicial real y los factores
    const computedDays = Object.entries(predictionFactors).map(([day, factor]) => {
      const demand = customRound(initialDemand * factor);
      const insumos = servicioSeleccionado.insumos.map(item => {
        const rawTotal = item.cantidadPorServicio * demand;
        const total = item.nombre.toLowerCase().includes('(l)')
          ? rawTotal.toFixed(2)
          : customRound(rawTotal);
        return { nombre: item.nombre, total };
      });
      return { day: Number(day), demand, insumos };
    });

    const tableResults = [initialRow, day5Row, ...computedDays].sort((a, b) => a.day - b.day);

    const tableResultsConVariacion = tableResults.map((result, index) => {
      if (index === 0) return { ...result, variacion: 'Inicial' };
      const prevDemand = tableResults[index - 1].demand;
      const variacion = result.demand > prevDemand 
        ? 'Creció' 
        : result.demand < prevDemand 
          ? 'Decreció' 
          : 'Sin cambio';
      return { ...result, variacion };
    });

    console.log("Resultados con variación:", tableResultsConVariacion);
    setResultados(tableResultsConVariacion);
    setChartData(null);
    setChartDataAll(null);
  };

  // Función para preparar la gráfica del servicio seleccionado (toda la evolución)
  const handleGraph = () => {
    if (!resultados.length) return;
    const labels = resultados.map(row => row.day);
    const demandData = resultados.map(row => row.demand);
    
    // Colores para los insumos (evitando tonos amarillos)
    const insumoColors = [
      'rgba(245, 48, 252, 0.8)',   // rojo
      'rgba(25, 124, 114, 0.8)',   // teal
      'rgba(156,39,176,0.8)',  // morado
      'rgba(0,188,212,0.8)',   // cian
      'rgba(233,30,99,0.8)'    // rosa
    ];
    
    const insumoNames = servicioSeleccionado.insumos.map(item => item.nombre);
    const insumoDatasets = insumoNames.map((insumoName, idx) => {
      const data = resultados.map(row => {
        const insumoItem = row.insumos.find(ins => ins.nombre === insumoName);
        return insumoItem ? parseFloat(insumoItem.total) : 0;
      });
      return {
        label: insumoName,
        data,
        backgroundColor: insumoColors[idx % insumoColors.length]
      };
    });

    const data = {
      labels,
      datasets: [
        {
          label: 'Servicios Demandados',
          data: demandData,
          backgroundColor: 'rgba(66,165,245,0.8)' // azul
        },
        ...insumoDatasets
      ]
    };

    setChartData(data);
  };

  // Función para preparar la gráfica de la demanda a 30 días de TODOS los servicios
  const handleGraphAll = () => {
    const labels = servicios.map(s => s.nombre);
    const data = servicios.map(s => customRound(s.demandaInicial * predictionFactors[30]));
    
    const chartDataAllObj = {
      labels,
      datasets: [
        {
          label: 'Demanda a 30 días',
          data,
          backgroundColor: 'rgba(99, 179, 92, 0.8)' // azul
        }
      ]
    };
    
    setChartDataAll(chartDataAllObj);
  };

  return (
    <div className="max-w-[900px] mx-auto p-5 font-sans bg-fondoClaro dark:bg-fondoObscuro">
      <h1 className="text-center navbar-title text-yellow-400">Aplicación del Taller</h1>
      
      {/* Row con selección e información */}
      <div className="flex flex-wrap gap-4 justify-around mt-4">
        <ServiceSelectCard
          servicios={servicios}
          selected={servicioSeleccionado}
          onSelect={(servicio) => {
            setServicioSeleccionado(servicio);
            setResultados([]);
            setChartData(null);
            setChartDataAll(null);
          }}
          onCalculate={handleCalculate}
        />
        {servicioSeleccionado && <ServiceInfoCard servicio={servicioSeleccionado} />}
      </div>
      
      {/* Tabla de Resultados */}
      {resultados.length > 0 && servicioSeleccionado && (
        <ResultsCard servicio={servicioSeleccionado} resultados={resultados} />
      )}

      {/* Botón y gráfica para el servicio seleccionado */}
      {resultados.length > 0 && (
        <div className="mt-5 text-center">
          <button className="btn-aceptar" onClick={handleGraph}>
            Graficar demanda del producto
          </button>
        </div>
      )}
      {chartData && (
        <div className="mt-5">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Botón y gráfica para la demanda a 30 días de TODOS los servicios */}
      <div className="mt-5 text-center">
        <button className="btn-blue" onClick={handleGraphAll}>
          Graficar demanda mensual de los servicios
        </button>
      </div>
      {chartDataAll && (
        <div className="mt-5">
          <Bar data={chartDataAll} options={chartOptions} />
        </div>
      )}
    </div>
  );
}



