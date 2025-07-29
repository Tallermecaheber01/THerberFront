import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import Breadcrumbs from '../Breadcrumbs';
import { login } from '../../api/public';
import { AuthContext } from '../AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { getRole } from '../../api/public';

const Login = () => {
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Login', link: '/login' },
  ];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateAuth } = useContext(AuthContext);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const validateInput = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
          value.length < 12
        ) {
          error = 'Correo inválido. Debe tener al menos 12 caracteres y un @.';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateInput('email', email);
    const passwordError = validateInput('password', password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    if (!captchaValue) {
      toast.error('Valida el reCAPTCHA');
      return;
    }

    try {
      const response = await login({ correo: email, contrasena: password, captcha: captchaValue });


      if (response) {
        console.log(response.token)
        document.cookie = `authToken=${response.token}; SameSite=None; Secure; path=/`;
        const roleResponse = await getRole(email);
        const role = roleResponse.rol;
        toast.success('¡Inicio de sesión exitoso!');
        console.log()
        updateAuth();

        // Extraer el token de las cookies
        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("authToken="))
          ?.split("=")[1];

        if (token) {

          //Establecer el tiempo de expiracion basado en el rol
          const expirationTime = role === 'cliente' ? 60 * 60 * 1000 : 30 * 60 * 1000; // 1 hora para cliente, 30 minutos para personal autorizado

          // Imprimir el tiempo de expiración en consola

          // Calcular la hora exacta en que expira la cookie
          const expirationDate = new Date(Date.now() + expirationTime);

          // Formatear la fecha y hora para mostrarla de forma más legible
          const expirationTimeFormatted = expirationDate.toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City', // Ajuste a la zona horaria de México
            hour12: false, // Formato de 24 horas
          });

          // Imprimir la hora exacta en que expira el token
          console.log(`Hora de expiración del token para ${role}: ${expirationTimeFormatted}`);


          setTimeout(() => {

            // Eliminar la cookie después del tiempo segun haya sido
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.info("Tu sesión ha expirado.");
            navigate('/login'); // Redirigir a la página de login
          }, expirationTime); // segun el tipo de usuario
        }

        setTimeout(() => navigate('/Bienvenida'), 3000);
      } else {
        toast.error('Credenciales incorrectas.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401)
          toast.error('Usuario o contraseña incorrectos.');
        else if (error.response.status === 500)
          toast.error('Error en el servidor. Intenta más tarde.');
        else toast.error('Ocurrió un error inesperado.');
      } else {
        toast.error('No hay respuesta del servidor. Verifica tu conexión.');
      }
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingresa tu correo"
                className="form-input"
              />
              {errors.email && (
                <p className="textError">
                  <FiXCircle className="iconoError" /> {errors.email}
                </p>
              )}
            </div>

            <div className="form-group relative">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingresa tu contraseña"
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-9 text-black dark:text-white"
              >
                {showPassword ? (
                  <FiEyeOff className="iconoVer" />
                ) : (
                  <FiEye className="iconoVer" />
                )}
              </button>
              {errors.password && (
                <p className="textError">
                  <FiXCircle className="iconoError" /> {errors.password}
                </p>
              )}
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
                <ReCAPTCHA
                  sitekey="6LeG5PAqAAAAAEKr3HP3C_W5OiL5HpPHCFxY5pMK"
                  onChange={onCaptchaChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-aceptar">
              Iniciar Sesión
            </button>
          </form>

          <div className="form-footer">
            <Link to="/recuperacion" className="form-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;

