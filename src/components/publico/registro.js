import React, { useRef, useState } from 'react';
// Importa React y los hooks useRef (para referencias a campos) y useState (para manejar estados).

import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
// Íconos de error y visibilidad de contraseña.

import { ToastContainer, toast } from 'react-toastify';
// Biblioteca para mostrar notificaciones emergentes.

import { useNavigate } from 'react-router-dom';
// Hook para redirigir a otras rutas.

import 'react-toastify/dist/ReactToastify.css';
// Estilos predeterminados de las notificaciones.

import { registerUser, sendVerificationCode2, verifyCode2 } from '../../api/users';

function Registro() {
  // Referencias para los valores de los campos del formulario.
  const nombreReg = useRef(null);
  const apellidoPaternoReg = useRef(null);
  const apellidoMaternoReg = useRef(null);
  const correoReg = useRef(null);
  const telefonoReg = useRef(null);
  const contrasenaReg = useRef(null);
  const confirmacionContrasenaReg = useRef(null);

  // Estados para manejar errores y visibilidad de las contraseñas.
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false); // Controla la visibilidad del formulario de verificación
  const [verificationCode, setVerificationCode] = useState(''); // Código de verificación
  const [userData, setUserData] = useState(null);  // Datos del usuario que se van a guardar una vez validado el código

  const navigate = useNavigate();
  // Hook para redirigir después del registro.

  // Validación de cada campo del formulario según el tipo de dato.
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
          return 'Correo no válido (12-60 caracteres)';
        }
        break;
      case 'telefono':
        if (!/^\d{10}$/.test(value)) {
          return 'Solo valores numéricos (10 dígitos)';
        }
        break;
      case 'contrasena':
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(value)) {
          return 'Debe tener 8-20 caracteres, un símbolo, mayúscula y número.';
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

  // Maneja la validación de los campos al perder el foco.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Limpia todos los campos y errores del formulario.
  const handleCancelar = () => {
    nombreReg.current.value = '';
    apellidoPaternoReg.current.value = '';
    apellidoMaternoReg.current.value = '';
    correoReg.current.value = '';
    telefonoReg.current.value = '';
    contrasenaReg.current.value = '';
    confirmacionContrasenaReg.current.value = '';
    setErrors({});
  };

  // Alterna la visibilidad de las contraseñas.
  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación previa de todos los campos.
    const errors = {};
    ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'contrasena', 'confirmacionContrasena'].forEach((field) => {
      const error = validateInput(field, eval(`${field}Reg.current.value`));
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors); // Actualiza los errores si hay alguno.
      return;
    }
    //Datos del usuario para el registro
    const userData = {
      nombre: nombreReg.current.value,
      apellido_paterno: apellidoPaternoReg.current.value,
      apellido_materno: apellidoMaternoReg.current.value,
      correo: correoReg.current.value,
      telefono: telefonoReg.current.value,
      contrasena: contrasenaReg.current.value,
    };

    try {
      // Enviar los datos al backend para registrar y enviar el código de verificación

      setShowVerificationForm(true); // Mostrar el formulario de verificación
      setUserData(userData); // Guardar los datos para usarlos luego de la verificación
      await sendVerificationCode2(userData.correo);
      toast.success("¡Código de verificación enviado!");

    } catch (error) {
      toast.error("Error al registrar cuenta", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (verificationCode === "") {
      toast.error("Por favor ingresa el código de verificación", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Validar el código de verificación
      const response = await verifyCode2(userData.correo, verificationCode);
      console.log(userData.correo)
      console.log(verificationCode, 'xd')
      console.log('Respuesta de la API:', response);
      console.log("Respuesta de verificacion code2", response);
      await registerUser(userData);
      toast.success("¡Usuario Registrado correctamente!");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error("Error en la verificación", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };



  return (
    <div className="form-container">
      {/* Mostrar solo el formulario de registro si no se ha mostrado el formulario de verificación */}
      {!showVerificationForm && (
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
                  className={`form-input`}
                  ref={{ nombre: nombreReg, apellidoPaterno: apellidoPaternoReg, apellidoMaterno: apellidoMaternoReg }[field]}
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
                className={`form-input`}
                ref={correoReg}
                onBlur={handleBlur}
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
                className={`form-input`}
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
            <div className="form-group relative">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasena"
                name="contrasena"
                placeholder="Ingresa tu contraseña"
                className={`form-input`}
                ref={contrasenaReg}
                onBlur={handleBlur}
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
            </div>
            <div className="form-group relative">
              <label htmlFor="confirmacionContrasena" className="form-label">Confirmar Contraseña</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmacionContrasena"
                name="confirmacionContrasena"
                placeholder="Confirma tu contraseña"
                className={`form-input`}
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
      )}

      {/* Formulario de verificación */}
      {showVerificationForm && (
        <div className="form-card mt-6">
          <h2 className="form-title">Verificación</h2>
          <form onSubmit={handleVerificationSubmit}>
            <div className="form-group">
              <label htmlFor="verificationCode" className="form-label">Código de Verificación</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                placeholder="Ingresa el código"
                className="form-input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <div className="form-group flex gap-4 mt-4">
              <button type="submit" className="btn-aceptar">Verificar</button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
export default Registro;