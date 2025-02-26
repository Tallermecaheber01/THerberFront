import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Breadcrumbs';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onCancel}
      ></div>
      <div className="bg-white p-6 rounded shadow-lg z-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button className="btn-aceptar" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const clientes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    cars: [{ marca: 'Toyota', modelos: ['Corolla 2019', 'Camry 2020'] }],
  },
  {
    id: 2,
    nombre: 'María Gómez',
    cars: [
      { marca: 'Honda', modelos: ['Civic 2018', 'Accord 2019'] },
      { marca: 'Ford', modelos: ['Focus 2020'] },
    ],
  },
  {
    id: 3,
    nombre: 'Carlos López',
    cars: [
      { marca: 'Ford', modelos: ['Focus 2020', 'Mustang 2021'] },
      { marca: 'Chevrolet', modelos: ['Spark 2018'] },
    ],
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    cars: [{ marca: 'Hyundai', modelos: ['Elantra 2019'] }],
  },
  {
    id: 5,
    nombre: 'Luis Rodríguez',
    cars: [
      { marca: 'Nissan', modelos: ['Sentra 2020', 'Altima 2021'] },
      { marca: 'Toyota', modelos: ['RAV4 2022'] },
    ],
  },
  {
    id: 6,
    nombre: 'Sofía García',
    cars: [
      { marca: 'Kia', modelos: ['Rio 2018'] },
      { marca: 'Hyundai', modelos: ['Accent 2019', 'Elantra 2020'] },
    ],
  },
  {
    id: 7,
    nombre: 'Miguel Torres',
    cars: [{ marca: 'Chevrolet', modelos: ['Cruze 2019'] }],
  },
];

function RegistroReparacion() {
  const allowedServices = [
    'Cambio de aceite',
    'Revisión general',
    'Cambio de llantas',
    'Afinación',
    'Cambio de pastillas',
  ];

  const [cita, setCita] = useState(null);
  const [comentario, setComentario] = useState('');
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState('');
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [empleado, setEmpleado] = useState('Pedro Pérez');
  const [atencionDateTime, setAtencionDateTime] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [errors, setErrors] = useState({});
  const [showNormalConfirmation, setShowNormalConfirmation] = useState(false);
  const [showExtraConfirmation, setShowExtraConfirmation] = useState(false);

  const pad = (num) => String(num).padStart(2, '0');

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta citas', link: '/consultacitas' },
    { name: 'Registro reparacion', link: '/registroreparaciones' },
  ];
  useEffect(() => {
    const storedCita = localStorage.getItem('selectedCita');
    if (storedCita) {
      const citaObj = JSON.parse(storedCita);
      setCita(citaObj);
      setComentario(citaObj.comentario || '');
      setTempCost(parseFloat(citaObj.costo));
      const serviciosIniciales = citaObj.servicio
        ? citaObj.servicio.split('\n')
        : [];
      setTempServices(serviciosIniciales);
      const ahora = new Date();
      const formattedDateTime = `${pad(ahora.getDate())}/${pad(ahora.getMonth() + 1)}/${ahora.getFullYear()} ${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
      setAtencionDateTime(formattedDateTime);
      setEmpleado('Pedro Pérez');
    } else {
      const ahora = new Date();
      const formattedDateTime = `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}T${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`;
      setAtencionDateTime(formattedDateTime);
      setTempCost(0);
    }
  }, []);

  const handleSumarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    const newCost = parseFloat(tempCost) + extraVal;
    setTempCost(newCost);
    setExtra(0);
  };

  const handleRestarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    let newCost = parseFloat(tempCost) - extraVal;
    if (newCost < 0) newCost = 0;
    setTempCost(newCost);
    setExtra(0);
  };

  const handleServicioExtraChange = (e) => {
    const inputValue = e.target.value;
    setServiciosExtra(inputValue);
    if (inputValue.trim() !== '') {
      const filtered = allowedServices.filter((service) =>
        service.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion);
    setSuggestions([]);
  };

  const handleAgregarServicio = () => {
    const servicio = serviciosExtra.trim();
    if (servicio !== '' && allowedServices.includes(servicio)) {
      if (
        tempServices.includes(servicio) ||
        (cita && cita.servicio && cita.servicio.split('\n').includes(servicio))
      ) {
        setErrors((prev) => ({
          ...prev,
          serviciosExtra: 'El servicio ya ha sido agregado.',
        }));
        return;
      }
      setTempServices((prev) => [...prev, servicio]);
      setServiciosExtra('');
      setSuggestions([]);
      setErrors((prev) => ({ ...prev, serviciosExtra: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        serviciosExtra: 'El servicio ingresado no es válido.',
      }));
    }
  };

  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  const containsSQLInjection = (input) => {
    const pattern =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC)\b)|(--)|(;)/i;
    return pattern.test(input);
  };


  const validateNormal = () => {
    const newErrors = {};
    if (!atencionDateTime) {
      newErrors.atencionDateTime = 'La fecha y hora de atención es requerida.';
    }
    if (tempServices.length === 0) {
      newErrors.tempServices =
        'Debe agregarse al menos un servicio para poder guardar el registro.';
    }
    if (comentario && containsSQLInjection(comentario)) {
      newErrors.comentario = 'El comentario contiene caracteres inválidos.';
    }
    return newErrors;
  };

  const validateExtra = () => {
    const newErrors = {};
    if (!selectedClient) {
      newErrors.selectedClient = 'Debe seleccionar un cliente.';
    }
    if (!selectedMarca) {
      newErrors.selectedMarca = 'Debe seleccionar una marca.';
    }
    if (!selectedModelo) {
      newErrors.selectedModelo = 'Debe seleccionar un modelo.';
    }
    if (!atencionDateTime) {
      newErrors.atencionDateTime = 'La fecha y hora de atención es requerida.';
    }
    if (tempServices.length === 0) {
      newErrors.tempServices =
        'Debe agregarse al menos un servicio para poder guardar el registro.';
    }
    if (comentario && containsSQLInjection(comentario)) {
      newErrors.comentario = 'El comentario contiene caracteres inválidos.';
    }
    return newErrors;
  };

  const saveReparacion = () => {
    let reparacion;
    if (cita) {
      const serviciosFinales = tempServices.join('\n');
      reparacion = {
        ...cita,
        comentario,
        costo: tempCost,
        servicio: serviciosFinales,
        empleado,
        atencionDateTime,
      };
    } else {
      const serviciosFinales = tempServices.join('\n');
      reparacion = {
        cliente: selectedClient.nombre,
        marca: selectedMarca,
        modelo: selectedModelo,
        comentario,
        costo: tempCost,
        servicio: serviciosFinales,
        empleado,
        atencionDateTime,
      };
    }
    console.log('Datos de la reparación guardados:', reparacion);
    cerrarFormulario();
  };

  const handleSubmitNormal = () => {
    const validationErrors = validateNormal();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setShowNormalConfirmation(true);
  };

  const handleSubmitExtra = () => {
    const validationErrors = validateExtra();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setShowExtraConfirmation(true);
  };

  const handleCancelar = () => {
    cerrarFormulario();
  };

  const cerrarFormulario = () => {
    setCita(null);
    setComentario('');
    setExtra(0);
    setServiciosExtra('');
    setTempCost(0);
    setTempServices([]);
    setSuggestions([]);
    setAtencionDateTime('');
    setClientSearch('');
    setFilteredClients([]);
    setSelectedClient(null);
    setSelectedMarca('');
    setSelectedModelo('');
    setErrors({});
  };

  if (cita) {
    return (
      <div>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="citasContainer">
          <form className="citasForm flex flex-col">
            <h1 className="form-title text-center">Registro de Reparación</h1>
            <div className="reparacion-card mb-4">
              {/* Datos automáticos */}
              <div className="mb-2">
                <span className="detalle-label">Empleado: </span>
                <span className="detalle-costo">{empleado}</span>
              </div>
              <div className="mb-4">
                <span className="detalle-label">
                  Fecha y Hora de Atención:{' '}
                </span>
                <span className="detalle-costo">{atencionDateTime}</span>
                {errors.atencionDateTime && (
                  <div className="text-red-500 text-xs">
                    {errors.atencionDateTime}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <span className="detalle-label">Cliente: </span>
                <span className="detalle-costo">{cita.cliente}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Servicio: </span>
                <span className="detalle-costo">{cita.servicio}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Fecha cita: </span>
                <span className="detalle-costo">{cita.fecha}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Hora cita: </span>
                <span className="detalle-costo">{cita.hora}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Costo Actual: </span>
                <span className="detalle-costo">{`$${cita.costo}`}</span>
              </div>
              <div className="mb-2">
                <span className="detalle-label">Comentario: </span>
                <textarea
                  className="form-input w-full"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escribe un comentario sobre la reparación..."
                />
                {errors.comentario && (
                  <div className="text-red-500 text-xs">
                    {errors.comentario}
                  </div>
                )}
              </div>
              <div className="mb-2 flex flex-col sm:flex-row gap-2 items-center">
                <div>
                  <span className="detalle-label">Extra: </span>
                  <input
                    type="number"
                    min="0"
                    className="form-input w-32 text-right"
                    value={extra}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setExtra(val < 0 ? 0 : val);
                    }}
                    placeholder="Extra"
                  />
                </div>
                <button
                  type="button"
                  className="btn-aceptar mt-5"
                  onClick={handleSumarExtra}
                >
                  Sumar
                </button>
                <button
                  type="button"
                  className="btn-cancelar mt-5"
                  onClick={handleRestarExtra}
                >
                  Restar
                </button>
              </div>
              <div className="mb-2 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative">
                  <span className="detalle-label">Servicio Extra: </span>
                  <input
                    type="text"
                    className="form-input w-48 text-right"
                    value={serviciosExtra}
                    onChange={handleServicioExtraChange}
                    placeholder="Ej: Afinación"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 w-48 text-black">
                      {suggestions.map((sug, idx) => (
                        <div
                          key={idx}
                          className="p-1 cursor-pointer text-sm"
                          onClick={() => handleSelectSuggestion(sug)}
                        >
                          {sug}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.serviciosExtra && (
                    <div className="text-red-500 text-xs">
                      {errors.serviciosExtra}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-aceptar mt-5"
                  onClick={handleAgregarServicio}
                >
                  Añadir Servicio
                </button>
              </div>
              {tempServices.length > 0 && (
                <div className="mb-2">
                  <span className="detalle-label">Servicios: </span>
                  <ul className="detalle-costo text-sm">
                    {tempServices.map((serv, idx) => (
                      <li
                        key={idx}
                        className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded"
                      >
                        <span>{serv}</span>
                        <button
                          type="button"
                          className="btn-cancelar text-xs flex justify-center items-center"
                          onClick={() => handleQuitarServicio(serv)}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  {errors.tempServices && (
                    <div className="text-red-500 text-xs">
                      {errors.tempServices}
                    </div>
                  )}
                </div>
              )}
              <div className="mb-2">
                <span className="detalle-label">Total Final: </span>
                <span className="detalle-costo">{`$${tempCost}`}</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                className="btn-aceptar"
                onClick={handleSubmitNormal}
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        {showNormalConfirmation && (
          <ConfirmationModal
            title={
              <span className="text-yellow-500">
                Confirmación de Registro de Reparación
              </span>
            }
            message={<>¿Está seguro de guardar el registro de reparación?</>}
            onConfirm={() => {
              saveReparacion();
              setShowNormalConfirmation(false);
            }}
            onCancel={() => setShowNormalConfirmation(false)}
          />
        )}
      </div>
    );
  } else {
    return (
      <div>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="form-container w-[680px] mx-auto">
          <form className="citasForm flex flex-col">
            <h1 className="form-title text-center mb-1">
              Registro de Reparación Extra
            </h1>
            <div className="">
              <label className="detalle-label" htmlFor="atencionDateTime">
                Fecha y Hora de Atención:
              </label>
              <input
                id="atencionDateTime"
                type="datetime-local"
                className="form-input w-full text-sm"
                value={atencionDateTime}
                onChange={(e) => setAtencionDateTime(e.target.value)}
              />
              {errors.atencionDateTime && (
                <div className="text-red-500 text-xs">
                  {errors.atencionDateTime}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="detalle-label" htmlFor="clientSearch">
                Buscar Cliente:
              </label>
              <input
                id="clientSearch"
                type="text"
                className="form-input w-full text-sm"
                value={clientSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setClientSearch(value);
                  if (value.trim() !== '') {
                    const filtered = clientes.filter((client) =>
                      client.nombre.toLowerCase().includes(value.toLowerCase())
                    );
                    setFilteredClients(filtered);
                  } else {
                    setFilteredClients([]);
                  }
                }}
                placeholder="Nombre..."
              />
              {filteredClients.length > 0 && (
                <div className="absolute bg-white border border-gray-300 text-black w-full z-10">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="cursor-pointer text-sm p-1"
                      onClick={() => {
                        setSelectedClient(client);
                        setClientSearch(client.nombre);
                        setFilteredClients([]);
                        setSelectedMarca('');
                        setSelectedModelo('');
                      }}
                    >
                      {client.nombre}
                    </div>
                  ))}
                </div>
              )}
              {errors.selectedClient && (
                <div className="text-red-500 text-xs">
                  {errors.selectedClient}
                </div>
              )}
            </div>
            {selectedClient && (
              <>
                <div className="mb-1">
                  <label className="detalle-label" htmlFor="marcaSelect">
                    Marca:
                  </label>
                  <select
                    id="marcaSelect"
                    className="form-input w-full text-sm"
                    value={selectedMarca}
                    onChange={(e) => {
                      setSelectedMarca(e.target.value);
                      setSelectedModelo('');
                    }}
                  >
                    <option value="">Selecciona una marca</option>
                    {selectedClient.cars.map((car) => (
                      <option key={car.marca} value={car.marca}>
                        {car.marca}
                      </option>
                    ))}
                  </select>
                  {errors.selectedMarca && (
                    <div className="text-red-500 text-xs">
                      {errors.selectedMarca}
                    </div>
                  )}
                </div>
                {selectedMarca && (
                  <div className="mb-1">
                    <label className="detalle-label" htmlFor="modeloSelect">
                      Modelo:
                    </label>
                    <select
                      id="modeloSelect"
                      className="form-input w-full text-sm"
                      value={selectedModelo}
                      onChange={(e) => setSelectedModelo(e.target.value)}
                    >
                      <option value="">Selecciona un modelo</option>
                      {selectedClient.cars
                        .find((car) => car.marca === selectedMarca)
                        .modelos.map((modelo) => (
                          <option key={modelo} value={modelo}>
                            {modelo}
                          </option>
                        ))}
                    </select>
                    {errors.selectedModelo && (
                      <div className="text-red-500 text-xs">
                        {errors.selectedModelo}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="mb-1">
              <span className="detalle-label">Comentario: </span>
              <textarea
                className="form-input w-full text-sm"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Comentario..."
              />
              {errors.comentario && (
                <div className="text-red-500 text-xs">{errors.comentario}</div>
              )}
            </div>
            <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
              <div className="relative">
                <span className="detalle-label">Añadir servicio: </span>
                <input
                  type="text"
                  className="form-input w-full text-sm"
                  value={serviciosExtra}
                  onChange={handleServicioExtraChange}
                  placeholder="Ej: Afinación"
                />
                {suggestions.length > 0 && (
                  <div className="absolute bg-white border border-gray-300 text-black w-full z-10">
                    {suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-1 cursor-pointer text-sm"
                        onClick={() => handleSelectSuggestion(sug)}
                      >
                        {sug}
                      </div>
                    ))}
                  </div>
                )}
                {errors.serviciosExtra && (
                  <div className="text-red-500 text-xs">
                    {errors.serviciosExtra}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn-aceptar mt-5"
                onClick={handleAgregarServicio}
              >
                Agregar
              </button>
            </div>
            <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
              <div>
                <span className="detalle-label">Costo: </span>
                <input
                  type="number"
                  min="0"
                  className="form-input w-full text-sm"
                  value={extra}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setExtra(val < 0 ? 0 : val);
                  }}
                  placeholder="Extra"
                />
              </div>
              <button
                type="button"
                className="btn-aceptar mt-5"
                onClick={handleSumarExtra}
              >
                Sumar
              </button>
              <button
                type="button"
                className="btn-cancelar mt-5"
                onClick={handleRestarExtra}
              >
                Restar
              </button>
            </div>
            {tempServices.length > 0 && (
              <div className="mb-1">
                <span className="detalle-label">Servicios: </span>
                <ul className="detalle-costo text-sm">
                  {tempServices.map((serv, idx) => (
                    <li
                      key={idx}
                      className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded"
                    >
                      <span>{serv}</span>
                      <button
                        type="button"
                        className="btn-cancelar text-xs flex justify-center items-center"
                        onClick={() => handleQuitarServicio(serv)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                {errors.tempServices && (
                  <div className="text-red-500 text-xs">
                    {errors.tempServices}
                  </div>
                )}
              </div>
            )}
            <div className="mb-1">
              <span className="detalle-label">Total Final: </span>
              <span className="detalle-costo">{`$${tempCost}`}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className="btn-aceptar"
                onClick={handleSubmitExtra}
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        {showExtraConfirmation && (
          <ConfirmationModal
            title={
              <span className="text-yellow-500">
                Confirmación de Registro de Reparación Extra
              </span>
            }
            message={
              <>¿Está seguro de guardar el registro de reparación extra?</>
            }
            onConfirm={() => {
              saveReparacion();
              setShowExtraConfirmation(false);
            }}
            onCancel={() => setShowExtraConfirmation(false)}
          />
        )}
      </div>
    );
  }
}

export default RegistroReparacion;
