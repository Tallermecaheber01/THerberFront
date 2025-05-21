import React, { useState, useEffect, useRef } from 'react';
import Breadcrumbs from '../Breadcrumbs';

function RegistrarVehiculo() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    placa: '',
    vin: ''
  });
  const [modelosSugeridos, setModelosSugeridos] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const timerRef = useRef(null);

  // Obtener marcas ejemplo
  const marcasDisponibles = ['Honda', 'Chevrolet', 'Nissan', 'Ford', 'BMW'];

  // Maneja cambio de inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, ...(name === 'marca' ? { modelo: '' } : {}) }));
    if (name === 'marca') {
      setModelosSugeridos([]);
      setMostrarSugerencias(false);
    }
    if (name === 'modelo') {
      // Debounce para peticiones
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fetchModelos(formData.marca, value), 300);
    }
  };

  // Fetch modelos desde API
  const fetchModelos = async (marca, query) => {
    if (!marca) return;
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${marca}?format=json`);
      const data = await res.json();
      const modelos = data.Results.map(r => r.Model_Name).filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
      );
      setModelosSugeridos(modelos);
      setMostrarSugerencias(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Seleccionar sugerencia
  const handleSelectModelo = modelo => {
    setFormData(prev => ({ ...prev, modelo }));
    setMostrarSugerencias(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Vehículo registrado:', formData);
    // reset
    setFormData({ marca: '', modelo: '', anio: '', placa: '', vin: '' });
  };

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs paths={[{ name: 'Inicio', link: '/' }, { name: 'Registrar Vehículo', link: '/nuevovehiculo' }]} />
      <div className="form-card max-w-3xl mx-auto p-8">
        <h1 className="form-title mb-6 text-2xl">Registrar Vehículo</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marca */}
          <div className="form-group">
            <label className="form-label">Marca</label>
            <select name="marca" value={formData.marca} onChange={handleChange} className="form-input">
              <option value="" disabled>Selecciona una marca</option>
              {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Modelo autocomplete */}
          <div className="form-group relative">
            <label className="form-label">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="form-input"
              disabled={!formData.marca}
              placeholder={formData.marca ? 'Escribe para buscar modelo' : 'Selecciona marca primero'}
            />
            {mostrarSugerencias && modelosSugeridos.length > 0 && (
              <ul className="absolute z-50 bg-white border w-full max-h-48 overflow-auto mt-1">
                {modelosSugeridos.map((m, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectModelo(m)}
                  >{m}</li>
                ))}
              </ul>
            )}
            {formData.modelo && (
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, modelo: '' }))} className="absolute top-8 right-4 text-red-500">X</button>
            )}
          </div>

          {/* Año */}
          <div className="form-group">
            <label className="form-label">Año</label>
            <select name="anio" value={formData.anio} onChange={handleChange} className="form-input">
              <option value="" disabled>Selecciona un año</option>
              {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map(anio => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </div>

          {/* Placa & VIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Número de Placa</label>
              <input name="placa" value={formData.placa} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">VIN</label>
              <input name="vin" value={formData.vin} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => setFormData({ marca: '', modelo: '', anio: '', placa: '', vin: '' })} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-aceptar">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarVehiculo;