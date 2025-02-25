import React, { useState } from 'react';
import Breadcrumbs from "../Breadcrumbs";

function NuevoVehiculo() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    placa: '',
    vin: '',
  });

  const marcasYModelos = {
    Toyota: ['Corolla', 'Camry', 'RAV4'],
    Ford: ['F-150', 'Escape', 'Mustang'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    Chevrolet: ['Silverado', 'Equinox', 'Malibu'],
    Nissan: ['Altima', 'Sentra', 'Rogue'],
  };

  const anios = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      modelo: name === 'marca' ? '' : prev.modelo, // Solo reinicia modelo si cambia la marca
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.placa.trim() === '' || formData.vin.trim() === '') {
      alert('Los campos Número de Placa y VIN deben ser únicos.');
      return;
    }

    console.log('Vehículo registrado:', formData);

    setFormData({
      marca: '',
      modelo: '',
      anio: '',
      placa: '',
      vin: '',
    });

    alert('Vehículo registrado exitosamente.');
  };

  const handleCancel = () => {
    setFormData({
      marca: '',
      modelo: '',
      anio: '',
      placa: '',
      vin: '',
    });
    alert('Registro cancelado.');
  };

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" }, // Ruta al inicio
    { name: "Registrar vehiculo", link: "/nuevovehiculo" }, // Ruta al login
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Registrar Vehículo</h1>
        <form onSubmit={handleSubmit}>
          {/* Marca */}
          <div className="form-group">
            <label htmlFor="marca" className="form-label">
              Marca
            </label>
            <select
              id="marca"
              name="marca"
              className="form-input"
              value={formData.marca}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecciona una marca
              </option>
              {Object.keys(marcasYModelos).map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div className="form-group">
            <label htmlFor="modelo" className="form-label">
              Modelo
            </label>
            <select
              id="modelo"
              name="modelo"
              className="form-input"
              value={formData.modelo}
              onChange={handleChange}
              required
              disabled={!formData.marca}
            >
              <option value="" disabled>
                Selecciona un modelo
              </option>
              {formData.marca &&
                marcasYModelos[formData.marca].map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {modelo}
                  </option>
                ))}
            </select>
          </div>

          {/* Año de fabricación */}
          <div className="form-group">
            <label htmlFor="anio" className="form-label">
              Año de Fabricación
            </label>
            <select
              id="anio"
              name="anio"
              className="form-input"
              value={formData.anio}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecciona un año
              </option>
              {anios.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>

          {/* Número de placa */}
          <div className="form-group">
            <label htmlFor="placa" className="form-label">
              Número de Placa
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              className="form-input"
              value={formData.placa}
              onChange={handleChange}
              placeholder="Ingresa el número de placa"
              required
            />
          </div>

          {/* Número de serie (VIN) */}
          <div className="form-group">
            <label htmlFor="vin" className="form-label">
              Número de Serie (VIN)
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              className="form-input"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Ingresa el VIN"
              required
            />
          </div>

          {/* Botones */}
          <div className="form-group flex gap-4">
            <button type="submit" className="btn-aceptar">
              Registrar Vehículo
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default NuevoVehiculo;
