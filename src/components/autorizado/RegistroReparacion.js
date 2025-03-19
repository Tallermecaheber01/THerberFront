import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { createRepair, getAppointmentById } from '../../api/employ';
import { AuthContext } from '../AuthContext';
import { getAllServices } from '../../api/admin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onCancel}></div>
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

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

function RegistroReparacion() {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // Se recibe el id desde el state

  const [cita, setCita] = useState(null);
  const [comentario, setComentario] = useState('');
  const [extra, setExtra] = useState(0);
  const [serviciosExtra, setServiciosExtra] = useState('');
  const [tempCost, setTempCost] = useState(0);
  const [tempServices, setTempServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [empleado, setEmpleado] = useState('Pedro Pérez');
  const [atencionDateTime, setAtencionDateTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showNormalConfirmation, setShowNormalConfirmation] = useState(false);
  const [allServices, setAllServices] = useState([]);

  const pad = (num) => String(num).padStart(2, '0');

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Consulta citas', link: '/consultacitas' },
    { name: 'Registro reparacion', link: '/registroreparaciones' },
  ];

  useEffect(() => {
    if (id) {
      // Obtenemos la cita usando el id recibido
      getAppointmentById(id)
        .then((data) => {
          const citaData =
            Array.isArray(data) && data.length > 0 ? data[0] : data;
          setCita(citaData);
          setTempCost(parseFloat(citaData.total));
          let serviciosIniciales = [];
          if (citaData.services && Array.isArray(citaData.services)) {
            serviciosIniciales = citaData.services.map((item) => item.servicio);
          } else if (citaData.servicio) {
            serviciosIniciales = citaData.servicio.split('\n');
          }
          setTempServices(serviciosIniciales);
          setAtencionDateTime(new Date().toISOString());
          setEmpleado(citaData.nombreEmpleado || 'Pedro Pérez');
        })
        .catch((error) => {
          console.error("Error al obtener la cita:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    getAllServices()
      .then((data) => {
        setAllServices(data);
      })
      .catch((error) =>
        console.error("Error al obtener los servicios:", error)
      );
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
      const filtered = allServices.filter((service) =>
        service.nombre.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filtered.map((service) => service.nombre));
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
    const validService = allServices.find(
      (service) =>
        service.nombre.toLowerCase() === servicio.toLowerCase()
    );

    if (servicio !== '' && validService) {
      if (
        tempServices.includes(servicio) ||
        (cita &&
          cita.servicio &&
          cita.servicio.split('\n').includes(servicio))
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
      newErrors.tempServices = 'Debe agregarse al menos un servicio para poder guardar el registro.';
    }
    if (comentario && containsSQLInjection(comentario)) {
      newErrors.comentario = 'El comentario contiene caracteres inválidos.';
    }
    return newErrors;
  };

  const saveReparacion = async () => {
    let repairPayload;
    const idEmpleado = auth?.user?.id;
    if (cita) {
      const costoInicial = parseFloat(cita.total);
      const totalFinal = tempCost;
      const extraCost = totalFinal - costoInicial;
      repairPayload = {
        idEmpleado: idEmpleado,
        idCliente: cita.clienteId,
        idCita: cita.appointment_id,
        fechaHoraAtencion: new Date(atencionDateTime).toISOString(),
        servicio: tempServices,
        fechaCita: cita.fecha,
        horaCita: cita.hora,
        costoInicial: costoInicial,
        comentario: comentario,
        extra: extraCost,
        totalFinal: totalFinal,
      };
    }

    // En la función saveReparacion
    try {
      const response = await createRepair(repairPayload);
      console.log("Reparación creada:", response);
      toast.success("Reparación guardada correctamente");
      // Redirigir después de 6 segundos
      setTimeout(() => {
        navigate("/consultacitas");
      }, 1000); // Corregido a 6000 ms
    } catch (error) {
      console.error("Error al crear la reparación:", error);
      toast.error(error.message || "Error al guardar la reparación"); // Mensaje más descriptivo
    }
        
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
    setErrors({});
  };

  if (!cita) {
    return (
      <div>
        <Breadcrumbs paths={breadcrumbPaths} />
        <div className="form-container w-[680px] mx-auto">
          <h1 className="form-title text-center">No hay cita seleccionada, selecciona una cita para finalizar</h1>
        </div>
        <ToastContainer autoClose={6000} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container w-[680px] mx-auto">
        <form className="citasForm flex flex-col">
          <h1 className="form-title text-center">Registro de Reparación</h1>
          <div className="reparacion-card mb-4">
            <div className="mb-2">
              <span className="detalle-label">Empleado: </span>
              <span className="detalle-costo">{cita.nombreEmpleado || empleado}</span>
            </div>
            <div className="mb-4">
              <span className="detalle-label">Fecha y Hora de Atención: </span>
              <span className="detalle-costo">{formatDateTime(atencionDateTime)}</span>
              {errors.atencionDateTime && (
                <div className="text-red-500 text-xs">{errors.atencionDateTime}</div>
              )}
            </div>
            <div className="mb-2">
              <span className="detalle-label">Cliente: </span>
              <span className="detalle-costo">{cita.nombreCliente}</span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Servicio: </span>
              <span className="detalle-costo">
                {Array.isArray(cita.services)
                  ? cita.services.map((item) => item.servicio).join(', ')
                  : cita.servicio}
              </span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Fecha cita: </span>
              <span className="detalle-costo">{formatDate(cita.fecha)}</span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Hora cita: </span>
              <span className="detalle-costo">{cita.hora}</span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Marca: </span>
              <span className="detalle-costo">{cita.marca}</span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Modelo: </span>
              <span className="detalle-costo">{cita.modelo}</span>
            </div>
            <div className="mb-2">
              <span className="detalle-label">Costo Actual: </span>
              <span className="detalle-costo">{`$${cita.total}`}</span>
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
                <div className="text-red-500 text-xs">{errors.comentario}</div>
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
              <button type="button" className="btn-aceptar mt-5" onClick={handleSumarExtra}>
                Sumar
              </button>
              <button type="button" className="btn-cancelar mt-5" onClick={handleRestarExtra}>
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
                  <div className="text-red-500 text-xs">{errors.serviciosExtra}</div>
                )}
              </div>
              <button type="button" className="btn-aceptar mt-5" onClick={handleAgregarServicio}>
                Añadir Servicio
              </button>
            </div>
            {tempServices.length > 0 && (
              <div className="mb-2">
                <span className="detalle-label">Servicios: </span>
                <ul className="detalle-costo text-sm">
                  {tempServices.map((serv, idx) => (
                    <li key={idx} className="grid grid-cols-[1fr_20px] items-center gap-1 px-2 rounded">
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
                  <div className="text-red-500 text-xs">{errors.tempServices}</div>
                )}
              </div>
            )}
            <div className="mb-2">
              <span className="detalle-label">Total Final: </span>
              <span className="detalle-costo">{`$${tempCost}`}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button type="button" className="btn-aceptar" onClick={handleSubmitNormal}>
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {showNormalConfirmation && (
        <ConfirmationModal
          title={<span className="text-yellow-500">Confirmación de Registro de Reparación</span>}
          message={<>¿Está seguro de guardar el registro de reparación?</>}
          onConfirm={() => {
            saveReparacion();
            setShowNormalConfirmation(false);
          }}
          onCancel={() => setShowNormalConfirmation(false)}
        />
      )}
      <ToastContainer autoClose={6000} />
    </div>
  );
}

export default RegistroReparacion;
