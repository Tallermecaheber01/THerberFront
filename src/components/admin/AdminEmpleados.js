import React, { useEffect, useRef, useState } from 'react';
import { FiXCircle, FiEye, FiEyeOff, FiCheckCircle, FiTrash2, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllEmployers, createEmployer, deleteEmployer, getAllQuestions } from '../../api/public';
import Breadcrumbs from '../Breadcrumbs';

function AdminEmpleados() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Administrar Empleados', link: '/admin/empleados' },
  ];

  const nombreReg = useRef(null);
  const apellidoPaternoReg = useRef(null);
  const apellidoMaternoReg = useRef(null);
  const correoReg = useRef(null);
  const telefonoReg = useRef(null);
  const contrasenaReg = useRef(null);
  const confirmacionContrasenaReg = useRef(null);
  const securityQuestionReg = useRef(null);
  const securityAnswerReg = useRef(null);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    noSequence: false,
  });
  const [showRequirements, setShowRequirements] = useState(false);

  useEffect(() => {
    fetchEmpleados();
    fetchQuestions();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const data = await getAllEmployers();
      setEmpleados(data);
    } catch {
      toast.error('Error al cargar empleados');
    }
  };

  const fetchQuestions = async () => {
    try {
      const qs = await getAllQuestions();
      setQuestions(qs);
    } catch {
      toast.error('Error al cargar preguntas');
    }
  };

  const validateInput = (name, value) => {
    switch (name) {
      case 'nombre':
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]{3,20}$/.test(value)) return 'Solo letras (3-20 caracteres)';
        break;
      case 'correo':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length < 12 || value.length > 60) return 'Correo no válido (12-60 caracteres)';
        break;
      case 'telefono':
        if (!/^\d{10}$/.test(value)) return 'Solo números (10 dígitos)';
        break;
      case 'confirmacionContrasena':
        if (value !== contrasenaReg.current.value) return 'Las contraseñas no coinciden.';
        break;
      case 'securityAnswer':
        if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]{3,15}$/.test(value)) return '3-15 caracteres, sin especiales.';
        break;
      default:
        break;
    }
    return '';
  };

  const getPasswordChecks = pwd => ({
    minLength: pwd.length >= 8 && pwd.length <= 20,
    upperCase: /[A-Z]/.test(pwd),
    lowerCase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    specialChar: /[!@#$%^&*]/.test(pwd),
    noSequence: !/(12345|abcd)/.test(pwd),
  });

  const handleBlur = e => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateInput(name, value.trim()) }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'contrasena') {
      if (!showRequirements && value) setShowRequirements(true);
      setPasswordChecks(getPasswordChecks(value));
    }
    if (name === 'correo') {
      setErrors(prev => ({ ...prev, correo: validateInput('correo', value.trim()) }));
    }
  };

  const togglePasswordVisibility = type => {
    type === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'contrasena', 'confirmacionContrasena', 'securityAnswer'];
    const newErrors = {};
    fields.forEach(f => {
      const ref = {
        nombre: nombreReg,
        apellidoPaterno: apellidoPaternoReg,
        apellidoMaterno: apellidoMaternoReg,
        correo: correoReg,
        telefono: telefonoReg,
        contrasena: contrasenaReg,
        confirmacionContrasena: confirmacionContrasenaReg,
        securityAnswer: securityAnswerReg,
      }[f];
      const err = validateInput(f, ref.current.value);
      if (err) newErrors[f] = err;
    });
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    const empleado = {
      nombre: nombreReg.current.value,
      apellido_paterno: apellidoPaternoReg.current.value,
      apellido_materno: apellidoMaternoReg.current.value,
      correo: correoReg.current.value,
      telefono: telefonoReg.current.value,
      contrasena: contrasenaReg.current.value,
      confirmarContrasena: confirmacionContrasenaReg.current.value,
      preguntaSecretaId: securityQuestionReg.current.value,
      respuestaSecreta: securityAnswerReg.current.value,
    };

    try {
      await createEmployer(empleado);
      e.target.reset();
      fetchEmpleados();
    } catch {}
  };

  const handleDelete = async id => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployer(deletingId);
      fetchEmpleados();
      setDeletingId(null);
    } catch {
      toast.error('Error al eliminar empleado');
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const empleadosFiltrados = empleados.filter(e =>
    `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container flex flex-col items-center justify-center px-4">
        <div className="form-card w-full max-w-6xl">
          <h1 className="form-title text-2xl font-bold mb-4">Registro Empleados</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              {['nombre','apellidoPaterno','apellidoMaterno'].map(field => (
                <div className="form-group flex flex-col" key={field}>
                  <label htmlFor={field} className="form-label capitalize">
                    {field.replace(/([A-Z])/g,' $1')}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    ref={{ nombre: nombreReg, apellidoPaterno: apellidoPaternoReg, apellidoMaterno: apellidoMaternoReg }[field]}
                    onBlur={handleBlur}
                    className="form-input w-full"
                    placeholder={`Ingresa ${field.replace(/([A-Z])/g,' $1')}`}
                  />
                  {errors[field] && <p className="textError"><FiXCircle className="iconoError"/> {errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group flex flex-col">
                <label className="form-label">Correo Electrónico</label>
                <input
                  id="correo" name="correo" type="email"
                  ref={correoReg} onBlur={handleBlur} onChange={handleChange}
                  className="form-input w-full" placeholder="Ingresa tu correo"
                />
                {errors.correo && <p className="textError"><FiXCircle className="iconoError"/> {errors.correo}</p>}
              </div>
              <div className="form-group flex flex-col">
                <label className="form-label">Teléfono</label>
                <input
                  id="telefono" name="telefono" type="tel"
                  ref={telefonoReg} onBlur={handleBlur}
                  className="form-input w-full" placeholder="10 dígitos"
                />
                {errors.telefono && <p className="textError"><FiXCircle className="iconoError"/> {errors.telefono}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group flex flex-col">
                <label className="form-label">Pregunta de Seguridad</label>
                <select
                  ref={securityQuestionReg} defaultValue=""
                  className="form-input w-full"
                >
                  <option value="" disabled>Seleccione pregunta</option>
                  {questions.map(q => <option key={q.id} value={q.id}>{q.pregunta}</option>)}
                </select>
              </div>
              <div className="form-group flex flex-col">
                <label className="form-label">Respuesta de Seguridad</label>
                <input
                  id="securityAnswer" name="securityAnswer" type="text"
                  ref={securityAnswerReg} onBlur={handleBlur}
                  className="form-input w-full" placeholder="Tu respuesta"
                />
                {errors.securityAnswer && <p className="textError"><FiXCircle className="iconoError"/> {errors.securityAnswer}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {['contrasena','confirmacionContrasena'].map((field, idx) => (
                <div className="form-group relative flex flex-col" key={field}>
                  <label className="form-label capitalize">{field === 'contrasena' ? 'Contraseña' : 'Confirmar Contraseña'}</label>
                  <input
                    id={field} name={field}
                    type={field === 'contrasena' ? (showPassword?'text':'password'):(showConfirmPassword?'text':'password')}
                    ref={ field==='contrasena' ? contrasenaReg : confirmacionContrasenaReg }
                    onBlur={handleBlur}
                    onChange={ field==='contrasena' ? handleChange : undefined }
                    className="form-input w-full"
                    placeholder={field === 'contrasena' ? 'Ingresa tu contraseña' : 'Confirma contraseña'}
                  />
                  <button type="button" className="absolute right-3 top-9" onClick={() => togglePasswordVisibility(field === 'contrasena'? 'password':'confirm')}>
                    {field === 'contrasena' ? (showPassword? <FiEyeOff className="iconoVer"/>:<FiEye className="iconoVer"/>) : (showConfirmPassword? <FiEyeOff className="iconoVer"/>:<FiEye className="iconoVer"/>)}
                  </button>
                  {errors[field] && <p className="textError"><FiXCircle className="iconoError"/> {errors[field]}</p>}
                  {field === 'contrasena' && showRequirements && Object.values(passwordChecks).filter(Boolean).length < 6 && (
                    <ul className="requirements-list list-none p-0 mt-4">
                      {Object.entries(passwordChecks).map(([key, ok]) => (
                        <li className="flex items-center gap-2" key={key}>
                          {ok ? <FiCheckCircle className="iconoCorrect"/> : <FiXCircle className="iconoError"/>}
                          <span className="dark:text-gray-300">
                            {{ minLength: '8-20 caracteres', upperCase: 'Al menos una mayúscula', lowerCase: 'Al menos una minúscula', number: 'Al menos un número', specialChar: 'Al menos un carácter especial', noSequence: 'Sin secuencias obvias' }[key]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="form-group flex gap-4 mt-4">
              <button type="submit" className="btn-aceptar">Aceptar</button>
              <button type="button" className="btn-cancelar" onClick={() => window.location.reload()}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Lista de Empleados</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-10 pr-4 py-2 rounded-md shadow w-72 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {empleadosFiltrados.map(emp => (
            <li key={emp.id} className="p-4 rounded-xl shadow-md border border-gray-300 bg-white dark:bg-gray-800 dark:text-white flex flex-col justify-between">
              <div className="mb-2">
                <p className="font-semibold text-lg">{emp.nombre} {emp.apellido_paterno} {emp.apellido_materno}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{emp.correo}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{emp.telefono}</p>
              </div>
              <button
                onClick={() => handleDelete(emp.id)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition"
              >
                <FiTrash2 /> Eliminar empleado
              </button>
            </li>
          ))}
        </ul>
      </div>
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">¿Estás seguro de eliminar este empleado?</h3>
            <div className="flex justify-end gap-4">
              <button onClick={cancelDelete} className="btn-aceptar">Cancelar</button>
              <button onClick={confirmDelete} className="btn-cancelar">Eliminar</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default AdminEmpleados;
