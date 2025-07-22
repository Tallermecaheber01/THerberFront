import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CotizarPrecio() {
  const timerRef = useRef(null);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [servicios, setServicios] = useState([]);
  const [todosServicios, setTodosServicios] = useState([]);
  const [modelosSugeridos, setModelosSugeridos] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroServicio, setFiltroServicio] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    axios
      .get('https://prediccionprecios.onrender.com/servicios')
      .then((res) => setTodosServicios(res.data.servicios || []))
      .catch((err) => console.error('Error cargando servicios:', err));
  }, []);

  const fetchModelos = async (marca, query) => {
    if (!marca) return;
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${marca}?format=json`
      );
      const data = await res.json();
      const modelos = data.Results.map((r) => r.Model_Name).filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      );
      setModelosSugeridos(modelos);
      setMostrarSugerencias(true);
    } catch (err) {
      console.error('Error fetching modelos:', err);
    }
  };

  const handleChangeModelo = (e) => {
    const value = e.target.value;
    setModelo(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchModelos(marca, value), 300);
  };

  const handleSelectModelo = (nombreModelo) => {
    setModelo(nombreModelo);
    setMostrarSugerencias(false);
  };

  const handleServicioChange = (e) => {
    const { value, checked } = e.target;
    setServicios((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  };

  const handleLimpiarCampos = () => {
    setMarca('');
    setModelo('');
    setServicios([]);
    setFiltroServicio('');
    setMensajeError('');
    setResultado(null);
    setModelosSugeridos([]);
    setMostrarSugerencias(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultado(null);
    setMensajeError('');

    if (servicios.length === 0) {
      setMensajeError('⚠️ Debes seleccionar al menos un servicio para obtener una predicción.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'https://prediccionprecios.onrender.com/predict',
        { marca, modelo, servicios }
      );
      setResultado(res.data.total_estimado);
    } catch (err) {
      setResultado('No se pudo calcular el precio.');
    } finally {
      setLoading(false);
    }
  };

  const serviciosFiltrados = todosServicios.filter((s) =>
    s.toLowerCase().includes(filtroServicio.toLowerCase())
  );

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          Cotizador de Precio de Servicio
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Marca:</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
                setModelo('');
                setModelosSugeridos([]);
              }}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Modelo:</label>
            <input
              type="text"
              value={modelo}
              onChange={handleChangeModelo}
              disabled={!marca}
              placeholder={marca ? 'Escribe para buscar modelo' : 'Selecciona una marca primero'}
              required
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
            {mostrarSugerencias && modelosSugeridos.length > 0 && (
              <div className="absolute z-10 bg-white dark:bg-gray-700 border dark:border-gray-600 mt-1 w-full rounded-md max-h-40 overflow-y-auto shadow">
                {modelosSugeridos.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectModelo(m)}
                    className="px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-600 cursor-pointer"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Buscar servicio:</label>
            <input
              type="text"
              value={filtroServicio}
              onChange={(e) => setFiltroServicio(e.target.value)}
              placeholder="Buscar servicio..."
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 p-3">
              {serviciosFiltrados.map((s, i) => (
                <label key={i} className="block mb-1">
                  <input
                    type="checkbox"
                    value={s}
                    checked={servicios.includes(s)}
                    onChange={handleServicioChange}
                    className="mr-2"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {mensajeError && (
            <div className="bg-red-100 dark:bg-red-400 text-red-800 dark:text-white text-sm font-semibold text-center px-4 py-3 rounded-md">
              {mensajeError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            {loading ? 'Calculando...' : 'Calcular Costo'}
          </button>

          <button
            type="button"
            onClick={handleLimpiarCampos}
            className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Limpiar campos
          </button>
        </form>

        {resultado && (
          <div className="mt-6 text-center text-green-600 dark:text-green-400 font-bold text-xl">
            Costo aproximado: {typeof resultado === 'number' ? `$${resultado.toFixed(2)}` : resultado}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/consultaservicios">
            <button className="bg-gray-700 hover:bg-gray-800 text-white text-sm py-2 px-4 rounded-md transition">
              Volver al catálogo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CotizarPrecio;
