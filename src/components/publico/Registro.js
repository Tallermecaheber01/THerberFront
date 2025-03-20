import React, { useEffect, useRef, useState } from 'react';
import { FiXCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { sendVerificationCode, getAllQuestions } from '../../api/public';
import Breadcrumbs from '../Breadcrumbs';

function Registro() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Registro', link: '/registro' },
  ];

  const fetchData = async () => {
    try {
      const questionResponse = await getAllQuestions();
      console.log("Preguntas obtenidas:", questionResponse);
      setQuestions(questionResponse);
    } catch (error) {
      console.error("Error al obtener lod datos:", error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const nombreReg = useRef(null);
  const apellidoPaternoReg = useRef(null);
  const apellidoMaternoReg = useRef(null);
  const correoReg = useRef(null);
  const telefonoReg = useRef(null);
  const contrasenaReg = useRef(null);
  const confirmacionContrasenaReg = useRef(null);
  const securityQuestionReg = useRef(null);

  // para la se seguridad
  const securityAnswerReg = useRef(null);

  //las preguntas de seguridad
  /*const securityQuestions = [
    { id: 1, pregunta: "¿Qué color tenía tu primer automóvil?" },
    { id: 2, pregunta: "¿Cuál es la marca y modelo de tu primer automóvil?" },
    { id: 3, pregunta: "¿Cuál es la marca del automóvil que has llevado más veces a un taller?" },
    { id: 4, pregunta: "¿Cuál es el nombre de tu primera mascota?" },
    { id: 5, pregunta: "¿En qué ciudad naciste?" },
    { id: 6, pregunta: "¿Cuál era tu plato favorito cuando eras niño/a?" },
    { id: 7, pregunta: "¿Qué apodo te pusieron en tu infancia?" },
    { id: 8, pregunta: "¿Cuál fue el nombre de tu mejor amigo/a de la infancia?" },
    { id: 9, pregunta: "¿Cuál fue el nombre de tu escuela primaria?" },
    { id: 10, pregunta: "¿Cuál es el nombre de la calle donde creciste?" }
  ];*/


  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    noSequence: false,
  });

  // Función para validar los campos
  const validateInput = (name, value) => {
    switch (name) {
      case 'nombre':
      case 'apellidoPaterno':
      case 'apellidoMaterno':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]{3,20}$/.test(value)) {
          return 'Solo letras (3-20 caracteres)';
        }
        break;
      case 'correo':
        if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
          value.length < 12 ||
          value.length > 60
        ) {
          return 'Correo no válido (12-60 caracteres y @)';
        }
        if (/['";]/.test(value)) {
          return 'El correo no puede contener caracteres especiales.';
        }
        break;
      case 'telefono':
        if (!/^\d{10}$/.test(value)) {
          return 'Solo valores numéricos (10 dígitos)';
        }
        break;
      case 'confirmacionContrasena':
        if (value !== contrasenaReg.current.value) {
          return 'Las contraseñas no coinciden.';
        }
        break;
      case 'securityAnswer':
        if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]{3,15}$/.test(value)) {
          return 'La respuesta debe tener entre 3 y 15 caracteres y no incluir caracteres especiales.';
        }
        break;
      default:
        break;
    }
    return '';
  };

  // Función para verificar los requisitos de la contraseña
  const getPasswordChecks = (password) => {
    return {
      minLength: password.length >= 8 && password.length <= 20,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      noSequence: !/(12345|abcd)/.test(password),
    };
  };

  // Manejar el evento onBlur para validar los campos
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Manejar el evento onChange para actualizar los estados
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contrasena') {
      if (!showRequirements && value.length > 0) {
        setShowRequirements(true);
      }
      const checks = getPasswordChecks(value);
      setPasswordChecks(checks);
    }

    if (name === 'correo') {
      const error = validateInput(name, value.trim());
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Manejar el botón de cancelar
  const handleCancelar = () => {
    nombreReg.current.value = '';
    apellidoPaternoReg.current.value = '';
    apellidoMaternoReg.current.value = '';
    correoReg.current.value = '';
    telefonoReg.current.value = '';
    contrasenaReg.current.value = '';
    confirmacionContrasenaReg.current.value = '';
    // se limpian los nuevos campos 
    if (securityAnswerReg.current) securityAnswerReg.current.value = '';
    setErrors({});
    setShowRequirements(false);
    setPasswordChecks({
      minLength: false,
      upperCase: false,
      lowerCase: false,
      number: false,
      specialChar: false,
      noSequence: false,
    });
  };

  // Mostrar/ocultar contraseña
  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = [
      'nombre',
      'apellidoPaterno',
      'apellidoMaterno',
      'correo',
      'telefono',
      'contrasena',
      'confirmacionContrasena',
      'securityQuestion', // Validación de pregunta
      'securityAnswer', // Validación de respuesta
      // poner lo securityAnswer y securityQuestion
    ];

    const newErrors = {};
    fields.forEach((field) => {
      const value = eval(`${field}Reg.current.value`);
      const error = validateInput(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = {
      nombre: nombreReg.current.value,
      apellido_paterno: apellidoPaternoReg.current.value,
      apellido_materno: apellidoMaternoReg.current.value,
      correo: correoReg.current.value,
      telefono: telefonoReg.current.value,
      contrasena: contrasenaReg.current.value,
      preguntaSecreta: securityQuestionReg.current.value,  // Agregar ID de la pregunta seleccionada
      respuestaSecreta: securityAnswerReg.current.value,        // Agregar respuesta de seguridad
    };

    try {
      await sendVerificationCode(userData.correo);
      toast.success('¡Código de verificación enviado!');

      setTimeout(() => {
        navigate('/validacioncuenta', { state: { userData } });
      }, 3000);
    } catch (error) {
      toast.error('Error al registrar cuenta', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const totalChecks = Object.values(passwordChecks).filter(Boolean).length;
  const allChecksSatisfied = totalChecks === 6;

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card w-full max-w-4xl">
          <h1 className="form-title">Registro</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              {['nombre', 'apellidoPaterno', 'apellidoMaterno'].map((field) => (
                <div className="form-group flex flex-col" key={field}>
                  <label htmlFor={field} className="form-label capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    placeholder={`Ingresa tu ${field}`}
                    className="form-input w-full"
                    ref={{
                      nombre: nombreReg,
                      apellidoPaterno: apellidoPaternoReg,
                      apellidoMaterno: apellidoMaternoReg,
                    }[field]}
                    onBlur={handleBlur}
                  />
                  {errors[field] && (
                    <p className="textError">
                      <FiXCircle className="iconoError" />
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group flex flex-col">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="Ingresa tu correo"
                  className="form-input w-full"
                  ref={correoReg}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.correo && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.correo}
                  </p>
                )}
              </div>
              <div className="form-group flex flex-col">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="Ingresa tu número de teléfono"
                  className="form-input w-full"
                  ref={telefonoReg}
                  onBlur={handleBlur}
                />
                {errors.telefono && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.telefono}
                  </p>
                )}
              </div>
            </div>

            {/*  Pregunta y Respuesta de Seguridad */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group flex flex-col">
                <label htmlFor="securityQuestion" className="form-label">
                  Pregunta de Seguridad
                </label>
                <select
                  id="securityQuestion"
                  name="securityQuestion"
                  className="form-input w-full"
                  defaultValue=""
                  ref={securityQuestionReg} // Asegúrate de agregar un ref para poder acceder al valor
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Seleccione una pregunta
                  </option>
                  {questions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.pregunta}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group flex flex-col">
                <label htmlFor="securityAnswer" className="form-label">
                  Respuesta de Seguridad
                </label>
                <input
                  type="text"
                  id="securityAnswer"
                  name="securityAnswer"
                  placeholder="Ingresa tu respuesta"
                  className="form-input w-full"
                  ref={securityAnswerReg}
                  onBlur={handleBlur}
                />
                {errors.securityAnswer && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.securityAnswer}
                  </p>
                )}
              </div>
            </div>

            {/* aqui termina */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-group relative flex flex-col">
                <label htmlFor="contrasena" className="form-label">
                  Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contrasena"
                  name="contrasena"
                  placeholder="Ingresa tu contraseña"
                  className="form-input w-full"
                  ref={contrasenaReg}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? (
                    <FiEyeOff className="iconoVer" />
                  ) : (
                    <FiEye className="iconoVer" />
                  )}
                </button>
                {errors.contrasena && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.contrasena}
                  </p>
                )}
                {showRequirements && !allChecksSatisfied && (
                  <div className="requirements-list">
                    <ul className="list-none p-0 m-0">
                      <li className="flex items-center gap-2">
                        {passwordChecks.minLength ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">
                          Mínimo 8 caracteres (máx. 20)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordChecks.upperCase ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">Al menos una mayúscula</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordChecks.lowerCase ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">Al menos una minúscula</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordChecks.number ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">Al menos un número</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordChecks.specialChar ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">
                          Al menos un carácter especial (!@#$%^&*)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordChecks.noSequence ? (
                          <FiCheckCircle className="iconoCorrect" />
                        ) : (
                          <FiXCircle className="iconoError" />
                        )}
                        <span className="white-text">
                          Sin secuencias obvias como "12345" o "abcd"
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-group relative flex flex-col">
                <label htmlFor="confirmacionContrasena" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmacionContrasena"
                  name="confirmacionContrasena"
                  placeholder="Confirma tu contraseña"
                  className="form-input w-full"
                  ref={confirmacionContrasenaReg}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="iconoVer" />
                  ) : (
                    <FiEye className="iconoVer" />
                  )}
                </button>
                {errors.confirmacionContrasena && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.confirmacionContrasena}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group flex gap-4 mt-4">
              <button type="submit" className="btn-aceptar">
                Aceptar
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default Registro;
