import React, { useEffect, useState, useContext } from 'react'; 
import Breadcrumbs from '../Breadcrumbs';
import { AuthContext } from '../AuthContext';
import { getAllRepairs, getAllServices, updateRepair, getClientById } from '../../api/employ';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onCancel}
      ></div>
      <div className="bg-white p-6 rounded shadow-lg z-10 max-w-md w-full">
        <h2 className="text-yellow-500 font-bold mb-4">{title}</h2>
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

function ConsultasReparaciones() {
  const { auth } = useContext(AuthContext);
  const staticBreadcrumbs = [
    { name: 'Inicio', link: '/' },
    { name: 'Reparaciones Realizadas', link: '/ConsultasReparaciones' },
  ];

  // Estados para reparaciones y edición
  const [reparaciones, setReparaciones] = useState([]);
  const [repairSeleccionada, setRepairSeleccionada] = useState(null);
  const [pendingEditRepair, setPendingEditRepair] = useState(null);

  // Estados para la edición
  const [comentario, setComentario] = useState('');
  const [extra, setExtra] = useState(0);
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [serviciosExtra, setServiciosExtra] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [commentError, setCommentError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);

  // Estados para filtros y búsqueda
  const [filters, setFilters] = useState([{ type: '', value: '' }]);
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para almacenar los servicios obtenidos de la API
  const [allServices, setAllServices] = useState([]);

  // Obtenemos los servicios disponibles al cargar el componente
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getAllServices();
        setAllServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Obtenemos las reparaciones y se filtran según el rol del usuario:
  // Si el usuario es empleado, se muestran solo sus reparaciones.
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        let repairsData = await getAllRepairs();
        // Filtra solo las reparaciones del usuario logueado si es empleado.
        if (auth && auth.user && auth.user.id && auth.role === 'empleado') {
          repairsData = repairsData.filter(
            (repair) => repair.idEmpleado === auth.user.id
          );
        }
        
        console.log("Datos obtenidos de reparaciones:", repairsData);
  
        const formattedRepairs = await Promise.all(
          repairsData.map(async (repair) => {
            const costoNum = parseFloat(repair.costoInicial || repair.totalFinal || repair.total) || 0;
            const serviciosArray = Array.isArray(repair.servicio)
              ? repair.servicio
              : (typeof repair.servicio === 'string'
                  ? repair.servicio.split(', ')
                  : []);
  
            let clientName;
            if (repair.nombreCliente) {
              clientName = repair.nombreCliente;
            } else {
              try {
                const clientData = await getClientById(repair.idCliente);
                if (clientData) {
                  clientName = `${clientData.nombre} ${clientData.apellido_paterno} ${clientData.apellido_materno}`;
                } else {
                  clientName = String(repair.idCliente);
                }
              } catch (error) {
                clientName = String(repair.idCliente);
              }
            }
  
            return {
              id: repair.id,
              cliente: clientName || 'Sin nombre',
              fecha: repair.fechaCita || (repair.fechaHoraAtencion ? new Date(repair.fechaHoraAtencion).toLocaleDateString() : 'N/A'),
              hora: repair.horaCita || (repair.fechaHoraAtencion ? new Date(repair.fechaHoraAtencion).toLocaleTimeString() : 'N/A'),
              fechaHoraAtencion: repair.fechaHoraAtencion ? new Date(repair.fechaHoraAtencion).toLocaleString() : 'N/A',
              servicio: serviciosArray.join(', '),
              serviciosArray,
              costo: costoNum,
              total: repair.totalFinal || repair.total || 'N/A',
              comentario: repair.comentario || '',
              marca: repair.marca || '',
              modelo: repair.modelo || '',
            };
          })
        );
  
        setReparaciones(formattedRepairs);
      } catch (error) {
        console.error("Error al obtener reparaciones:", error);
      }
    };
  
    fetchRepairs();
  }, [auth]);
  
  // Función para sanitizar entradas
  const sanitizeInput = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/['";<>]/g, '');
  };

  // Maneja los cambios en el comentario
  const handleCommentChange = (e) => {
    const value = e.target.value;
    const invalidChars = /[\'";<>]/;
    if (invalidChars.test(value)) {
      setCommentError('El comentario contiene caracteres no permitidos.');
    } else {
      setCommentError('');
    }
    setComentario(value);
  };

  // Inicia la edición de una reparación
  const handleEditarReparacion = (repair) => {
    setRepairSeleccionada(repair);
    setComentario(repair.comentario || '');
    setExtra(0);
    setTempCost(Number(repair.costo));
    const serviciosIniciales = repair.serviciosArray || 
      (typeof repair.servicio === 'string'
        ? repair.servicio.split(', ')
        : []);
    setTempServices(serviciosIniciales);
    setServiciosExtra('');
    setSuggestions([]);
    setCommentError('');
    setServiceError('');
  };
  
  const confirmEditarReparacion = () => {
    if (pendingEditRepair) {
      handleEditarReparacion(pendingEditRepair);
      setPendingEditRepair(null);
      setIsEditConfirmModalOpen(false);
    }
  };

  // Funciones para sumar/restar extras
  const handleSumarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => prevCost + extraVal);
    setExtra(0);
  };

  const handleRestarExtra = () => {
    const extraVal = parseFloat(extra) || 0;
    setTempCost((prevCost) => {
      const newCost = prevCost - extraVal;
      return newCost < 0 ? 0 : newCost;
    });
    setExtra(0);
  };

  // Manejo del input para servicio extra, utilizando la propiedad "nombre"
  const handleServicioExtraChange = (e) => {
    const inputValue = e.target.value;
    setServiceError('');
    setServiciosExtra(inputValue);
    if (inputValue.trim() !== '') {
      const filtered = allServices.filter((service) => {
        return service.nombre.toLowerCase().includes(inputValue.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setServiciosExtra(suggestion.nombre);
    setSuggestions([]);
  };

  const handleAgregarServicio = () => {
    const serviceTrimmed = serviciosExtra.trim();
    if (serviceTrimmed === '') return;
  
    const validService = allServices.find(
      (service) => service.nombre.toLowerCase() === serviceTrimmed.toLowerCase()
    );
  
    if (!validService) {
      setServiceError('El servicio ingresado no es válido.');
      return;
    }
    if (tempServices.includes(validService.nombre)) {
      setServiceError('El servicio ya ha sido agregado.');
      return;
    }
    setTempServices((prev) => [...prev, validService.nombre]);
    setServiciosExtra('');
    setSuggestions([]);
    setServiceError('');
  };

  const handleQuitarServicio = (servicio) => {
    setTempServices((prev) => prev.filter((s) => s !== servicio));
  };

  // Al guardar la edición se arma el payload y se llama a updateRepair  
  const handleGuardarReparacion = async () => {
    if (!repairSeleccionada) return;
    const sanitizedComentario = sanitizeInput(comentario);
    const sanitizedTempServices = tempServices.map((s) => sanitizeInput(s));
    const payload = {
      servicio: sanitizedTempServices,
      costoInicial: repairSeleccionada.costo,
      comentario: sanitizedComentario,
      extra: tempCost - repairSeleccionada.costo,
      totalFinal: tempCost,
    };

    try {
      await updateRepair(repairSeleccionada.id, payload);
      const repairActualizada = {
         ...repairSeleccionada,
         comentario: sanitizedComentario,
         costo: tempCost,
         servicio: sanitizedTempServices.join(', '),
      };
      const nuevasReparaciones = reparaciones.map((rep) =>
        rep.id === repairSeleccionada.id ? repairActualizada : rep
      );
      setReparaciones(nuevasReparaciones);
      cerrarFormulario();
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  };

  const cerrarFormulario = () => {
    setRepairSeleccionada(null);
    setComentario('');
    setExtra(0);
    setServiciosExtra('');
    setTempCost(0);
    setTempServices([]);
    setSuggestions([]);
    setCommentError('');
    setServiceError('');
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    cerrarFormulario();
  };

  const handleGuardarButtonClick = () => {
    if (tempServices.length === 0) {
      setServiceError('Debe agregar al menos un servicio.');
      return;
    }
    setIsSaveConfirmModalOpen(true);
  };

  const confirmGuardarReparacion = async () => {
    await handleGuardarReparacion();
    setIsSaveConfirmModalOpen(false);
  };

  // Funciones y lógica para filtros y búsqueda
  const normalizeStr = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const getDynamicBreadcrumbs = () => {
    const activeFilters = filters.filter(
      (filter) => filter.type.trim() !== '' && filter.value.trim() !== ''
    );
    const filterBreadcrumbs = activeFilters.map((filter) => ({
      name:
        filter.type.charAt(0).toUpperCase() +
        filter.type.slice(1) +
        ': ' +
        filter.value,
      link: '#',
    }));
    return [...staticBreadcrumbs, ...filterBreadcrumbs];
  };

  const dynamicBreadcrumbs = getDynamicBreadcrumbs();

  const handleBreadcrumbClick = (index) => {
    if (index < staticBreadcrumbs.length) {
      setFilters([{ type: '', value: '' }]);
      setSearchQuery('');
    } else {
      const filterIndex = index - staticBreadcrumbs.length;
      setFilters(filters.slice(0, filterIndex + 1));
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleAddFilter = () => {
    if (
      filters.length < 3 &&
      filters[filters.length - 1].type.trim() !== '' &&
      filters[filters.length - 1].value.trim() !== ''
    ) {
      setFilters([...filters, { type: '', value: '' }]);
    }
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    if (newFilters.length === 0) newFilters.push({ type: '', value: '' });
    setFilters(newFilters);
  };

  const filteredRepairs = reparaciones.filter((repair) => {
    const matchesSearch =
      searchQuery === '' ||
      Object.values(repair).some((val) =>
        normalizeStr(String(val)).includes(normalizeStr(searchQuery))
      );
    const matchesAdvanced = filters.every((filter) => {
      if (filter.type.trim() === '' || filter.value.trim() === '') return true;
      const repairField = repair[filter.type.toLowerCase()];
      if (!repairField) return false;
      return normalizeStr(String(repairField)).includes(
        normalizeStr(filter.value)
      );
    });
    return matchesSearch && matchesAdvanced;
  });

  return (
    <div>
      <Breadcrumbs
        paths={dynamicBreadcrumbs}
        onCrumbClick={handleBreadcrumbClick}
      />
      <div className="citasContainer">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Reparaciones Realizadas</h1>
          <div className="w-full flex flex-col items-end mb-4 gap-4">
            {filters.length === 1 &&
              filters[0].type.trim() === '' &&
              filters[0].value.trim() === '' && (
                <input
                  type="text"
                  placeholder="Buscar reparaciones"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-72 text-right"
                />
              )}
            <div className="flex flex-col gap-4 items-end">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={filter.type}
                    onChange={(e) =>
                      handleFilterChange(index, 'type', e.target.value)
                    }
                    className="form-input w-64 text-right"
                  >
                    <option value="">Selecciona tipo de filtro</option>
                    {['cliente', 'servicio', 'marca', 'modelo', 'costo']
                      .filter((type) => {
                        if (filter.type === type) return true;
                        return !filters.some(
                          (f, i) => i !== index && f.type === type
                        );
                      })
                      .map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>
                  <input
                    type={filter.type.toLowerCase() === 'costo' ? 'number' : 'text'}
                    placeholder="Busqueda"
                    value={filter.value}
                    onChange={(e) =>
                      handleFilterChange(index, 'value', e.target.value)
                    }
                    className="form-input w-64 text-right"
                  />
                  {filters.length > 1 && (
                    <button
                      onClick={() => handleRemoveFilter(index)}
                      className="textError"
                      type="button"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              {filters.length < 3 &&
                filters[filters.length - 1].type.trim() !== '' &&
                filters[filters.length - 1].value.trim() !== '' && (
                  <button
                    onClick={handleAddFilter}
                    className="button-yellow w-40"
                    type="button"
                  >
                    Agregar Filtro
                  </button>
                )}
            </div>
          </div>
          <div className="mt-8">
            {filteredRepairs.length > 0 ? (
              <div className="cardCitas grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepairs.map((repair) => (
                  <div
                    key={repair.id}
                    className="reparacion-card p-4 rounded-md card-transition"
                  >
                    <div className="mb-1">
                      <span className="detalle-label">Fecha y Hora Atención: </span>
                      <span className="detalle-costo">{repair.fechaHoraAtencion}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Cliente: </span>
                      <span className="detalle-costo">{repair.cliente}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Servicio: </span>
                      <span className="detalle-costo">{repair.servicio}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Fecha: </span>
                      <span className="detalle-costo">{repair.fecha}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Hora: </span>
                      <span className="detalle-costo">{repair.hora}</span>
                    </div>
                    <div className="mb-1">
                      <span className="detalle-label">Total: </span>
                      <span className="detalle-costo">${repair.total}</span>
                    </div>
                    {repair.comentario && (
                      <div className="mb-1">
                        <span className="detalle-label">Comentario: </span>
                        <span className="detalle-costo">{repair.comentario}</span>
                      </div>
                    )}
                    {repair.marca && (
                      <div className="mb-1">
                        <span className="detalle-label">Marca: </span>
                        <span className="detalle-costo">{repair.marca}</span>
                      </div>
                    )}
                    {repair.modelo && (
                      <div className="mb-1">
                        <span className="detalle-label">Modelo: </span>
                        <span className="detalle-costo">{repair.modelo}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-aceptar w-full mt-2"
                      onClick={() => {
                        setPendingEditRepair(repair);
                        setIsEditConfirmModalOpen(true);
                      }}
                    >
                      Editar Reparación
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="advertencia">
                No se encontraron reparaciones con los filtros aplicados.
              </p>
            )}
          </div>
          {repairSeleccionada && (
            <div className="mt-8">
              <h2 className="cita-title text-center">Editar Reparación</h2>
              <div className="reparacion-card mb-4 p-4 rounded-md">
                <div className="mb-1">
                  <span className="detalle-label">Costo Actual: </span>
                  <span className="detalle-costo">${repairSeleccionada.costo}</span>
                </div>
                <div className="mb-1">
                  <span className="detalle-label">Comentario: </span>
                  <textarea
                    className="form-input w-full"
                    value={comentario}
                    onChange={handleCommentChange}
                    placeholder="Escribe un comentario sobre la reparación..."
                  />
                  {commentError && (
                    <span className="text-red-500 text-sm">{commentError}</span>
                  )}
                </div>
                <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
                  <div>
                    <span className="detalle-label">Extra: </span>
                    <input
                      type="number"
                      min="0"
                      className="form-input w-32 text-right"
                      value={extra === 0 ? '' : extra}
                      onChange={(e) => setExtra(Number(e.target.value))}
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
                <div className="mb-1 flex flex-col sm:flex-row gap-1 items-center">
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
                            {sug.nombre}
                          </div>
                        ))}
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
                {serviceError && (
                  <span className="text-red-500 text-sm">{serviceError}</span>
                )}
                {tempServices.length > 0 && (
                  <div className="mb-1">
                    <span className="detalle-label">Servicios: </span>
                    <ul className="detalle-costo">
                      {tempServices.map((serv, idx) => (
                        <li
                          key={idx}
                          className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded"
                        >
                          <span>{serv}</span>
                          <button
                            className="btn-cancelar text-xs flex justify-center items-center"
                            onClick={() => handleQuitarServicio(serv)}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-1">
                  <span className="detalle-label">Costo Nuevo: </span>
                  <span className="detalle-costo">${tempCost}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <button
                  type="button"
                  className="btn-aceptar mt-2"
                  onClick={handleGuardarButtonClick}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-cancelar mt-2"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      {isEditConfirmModalOpen && pendingEditRepair && (
        <ConfirmationModal
          title="Confirmar Edición"
          message={`¿Está seguro de que desea editar la reparación de ${pendingEditRepair.cliente}?`}
          onConfirm={confirmEditarReparacion}
          onCancel={() => {
            setIsEditConfirmModalOpen(false);
            setPendingEditRepair(null);
          }}
        />
      )}
      {isSaveConfirmModalOpen && (
        <ConfirmationModal
          title="Confirmar Guardado"
          message="¿Está seguro de que desea guardar los cambios de la reparación?"
          onConfirm={confirmGuardarReparacion}
          onCancel={() => setIsSaveConfirmModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ConsultasReparaciones;

