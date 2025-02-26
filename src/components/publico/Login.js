import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import Breadcrumbs from '../Breadcrumbs';
import { loginUser } from '../../api/users';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Login', link: '/login' },
  ];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateAuth } = useContext(AuthContext); // Usamos updateAuth para forzar la actualización
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateInput('email', email);
    const passwordError = validateInput('password', password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const response = await loginUser({ correo: email, contrasena: password });
      if (response) {
        toast.success('¡Inicio de sesión exitoso!');
        updateAuth(); // Forzar la actualización del estado de autenticación
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
                className="absolute right-3 top-9"
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
