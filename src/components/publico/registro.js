import React, { useRef, useState } from 'react';
import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
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
          return 'Correo no válido (12-60 caracteres y @)';
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

  // Validación dinámica de la contraseña
  const validContra = (value) => {
    const errors = [];
    if (value.length < 8 || value.length > 20) {
      errors.push('La contraseña debe tener entre 8 y 20 caracteres.');
    }
    else if (!/[A-Z]/.test(value)) {
      errors.push('Debe contener al menos una mayúscula.');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('Debe contener al menos una minúscula.');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('Debe contener al menos un número.');
    }
    if (!/[!@#$%^&*]/.test(value)) {
      errors.push('Debe contener al menos un símbolo (!@#$%^&*).');
    }
    return errors;
  };


  // Maneja la validación de los campos al perder el foco.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Maneja la validación de los campos mientras se escribe.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contrasena') {
      const passwordErrors = validContra(value);
      setErrors((prev) => ({ ...prev, [name]: passwordErrors.join(' ') }));
    } else if (name === 'correo') {
      const error = validateInput(name, value.trim());
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
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

    // Datos del usuario para el registro
    const userData = {
      nombre: nombreReg.current.value,
      apellido_paterno: apellidoPaternoReg.current.value,
      apellido_materno: apellidoMaternoReg.current.value,
      correo: correoReg.current.value,
      telefono: telefonoReg.current.value,
      contrasena: contrasenaReg.current.value,
    };

    try {
      // Enviar el código de verificación
      await sendVerificationCode2(userData.correo);
      toast.success("¡Código de verificación enviado!");

      setTimeout(() => {
        navigate('/ValidacionCuenta', { state: { userData } });
      }, 5000);

    } catch (error) {
      //navigate('/ValidacionCuenta', { state: { userData } });
      toast.error("Error al registrar cuenta", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

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
                onChange={handleChange} // Validación dinámica
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
                onChange={handleChange} // Validación dinámica
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default Registro;