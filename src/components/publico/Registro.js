import React, { useRef, useState } from 'react';
import { FiXCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser, sendVerificationCode2 } from '../../api/users';
import Breadcrumbs from "../Breadcrumbs";

function Registro() {
  const navigate = useNavigate();
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" },
    { name: "Registro", link: "/registro" },
  ];

  // Referencias para campos de formulario
  const nombreReg = useRef(null);
  const apellidoPaternoReg = useRef(null);
  const apellidoMaternoReg = useRef(null);
  const correoReg = useRef(null);
  const telefonoReg = useRef(null);
  const contrasenaReg = useRef(null);
  const confirmacionContrasenaReg = useRef(null);

  // Estados
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Para mostrar/ocultar el bloque de requisitos de contraseña
  const [showRequirements, setShowRequirements] = useState(false);

  // Estados para checks de la contraseña
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    noSequence: false,
  });

  // Función genérica para validar un campo (sin la barra de fortaleza)
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
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value.length < 12 || value.length > 60) {
          return 'Correo no válido (12-60 caracteres y @)';
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
      default:
        break;
    }
    return '';
  };

  /**
   * Verifica cada requisito individualmente y devuelve un objeto con booleans
   */
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

  // Maneja la validación al perder el foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Maneja la validación mientras se escribe
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contrasena') {
      // Muestra el bloque de requisitos en cuanto se empieza a escribir
      if (!showRequirements && value.length > 0) {
        setShowRequirements(true);
      }

      // Obtenemos checks y los guardamos en el estado
      const checks = getPasswordChecks(value);
      setPasswordChecks(checks);
    }

    // Validación en tiempo real para el correo (si lo deseas)
    if (name === 'correo') {
      const error = validateInput(name, value.trim());
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Limpia los campos
  const handleCancelar = () => {
    nombreReg.current.value = '';
    apellidoPaternoReg.current.value = '';
    apellidoMaternoReg.current.value = '';
    correoReg.current.value = '';
    telefonoReg.current.value = '';
    contrasenaReg.current.value = '';
    confirmacionContrasenaReg.current.value = '';
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

  // Alterna la visibilidad de la contraseña
  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación previa de todos los campos
    const fields = [
      'nombre',
      'apellidoPaterno',
      'apellidoMaterno',
      'correo',
      'telefono',
      'contrasena',
      'confirmacionContrasena',
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

    // Datos del usuario
    const userData = {
      nombre: nombreReg.current.value,
      apellido_paterno: apellidoPaternoReg.current.value,
      apellido_materno: apellidoMaternoReg.current.value,
      correo: correoReg.current.value,
      telefono: telefonoReg.current.value,
      contrasena: contrasenaReg.current.value,
    };

    try {
      // Enviar código de verificación
      await sendVerificationCode2(userData.correo);
      toast.success("¡Código de verificación enviado!");

      setTimeout(() => {
        navigate('/validacioncuenta', { state: { userData } });
      }, 3000);

    } catch (error) {
      toast.error("Error al registrar cuenta", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Calcula si se han cumplido todos los requisitos
  const totalChecks = Object.values(passwordChecks).filter(Boolean).length;
  const allChecksSatisfied = totalChecks === 6;

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Registro</h1>
          <form onSubmit={handleSubmit}>
            {['nombre', 'apellidoPaterno', 'apellidoMaterno'].map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field} className="form-label capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  placeholder={`Ingresa tu ${field}`}
                  className="form-input"
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

            <div className="form-group">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Ingresa tu correo"
                className="form-input"
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

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Ingresa tu número de teléfono"
                className="form-input"
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

            {/* CONTRASEÑA */}
            <div className="form-group relative">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasena"
                name="contrasena"
                placeholder="Ingresa tu contraseña"
                className="form-input"
                ref={contrasenaReg}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-9"
              >
                {showPassword ? <FiEyeOff className="iconoVer" /> : <FiEye className="iconoVer" />}
              </button>
              {errors.contrasena && (
                <p className="textError">
                  <FiXCircle className="iconoError" />
                  {errors.contrasena}
                </p>
              )}

              {/* Lista de requisitos: se muestra si el usuario comenzó a escribir y
                  todavía NO se cumplen todos los requisitos */}
             {showRequirements && !allChecksSatisfied && (
              <div className="requirements-list">
                <ul className="list-none p-0 m-0">
                  <li className="flex items-center gap-2">
                    {passwordChecks.minLength ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Mínimo 8 caracteres (máx. 20)</span>
                  </li>
                  <li className="flex items-center gap-2 ">
                    {passwordChecks.upperCase ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Al menos una mayúscula</span>
                  </li>
                  <li className="flex items-center gap-2 ">
                    {passwordChecks.lowerCase ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Al menos una minúscula</span>
                  </li>
                  <li className="flex items-center gap-2 ">
                    {passwordChecks.number ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Al menos un número</span>
                  </li>
                  <li className="flex items-center gap-2 ">
                    {passwordChecks.specialChar ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Al menos un carácter especial (!@#$%^&*)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.noSequence ? (
                      <FiCheckCircle className='iconoCorrect'/>
                    ) : (
                      <FiXCircle className="iconoError" />
                    )}
                    <span className="white-text">Sin secuencias obvias como "12345" o "abcd"</span>
                  </li>
                </ul>
              </div>
            )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="form-group relative">
              <label htmlFor="confirmacionContrasena" className="form-label">Confirmar Contraseña</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmacionContrasena"
                name="confirmacionContrasena"
                placeholder="Confirma tu contraseña"
                className="form-input"
                ref={confirmacionContrasenaReg}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-9"
              >
                {showConfirmPassword ? <FiEyeOff className="iconoVer" /> : <FiEye className="iconoVer" />}
              </button>
              {errors.confirmacionContrasena && (
                <p className="textError">
                  <FiXCircle className="iconoError" />
                  {errors.confirmacionContrasena}
                </p>
              )}
            </div>

            <div className="form-group flex gap-4 mt-4">
              <button type="submit" className="btn-aceptar">Aceptar</button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Registro;
