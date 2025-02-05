import React, { useState } from "react";
// Importa React y el hook useState para manejar estados.

import { Link, useNavigate } from "react-router-dom";
// Componente para crear enlaces a otras rutas.

import { FiXCircle, FiEye, FiEyeOff } from "react-icons/fi";
// Íconos para errores y visibilidad de contraseña.

import { ToastContainer, toast } from "react-toastify";

import Breadcrumbs from "../Breadcrumbs";
// Componente que muestra el rastro de navegación.

import { loginUser } from "../../api/users";


const Login = () => {

  const breadcrumbPaths = [
    { name: "Inicio", link: "/" }, 
    { name: "Login", link: "/login" },          
  ];
  // Estados para manejar los valores de los campos y errores.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // Controla la visibilidad de la contraseña.

  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // Valida los valores ingresados en los campos.
  const validateInput = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        // Valida formato de correo y longitud mínima.
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value.length < 12) {
          error = "Correo inválido. Debe tener al menos 12 caracteres y un @.";
        }
        break;
      case "password":
        // Valida longitud mínima de la contraseña.
        if (value.length < 8) {
          error = "La contraseña debe tener al menos 8 caracteres.";
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Valida el campo cuando pierde el foco.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Actualiza los valores de los campos y limpia errores si se edita.
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida los campos antes de enviar.
    const emailError = validateInput("email", email);
    const passwordError = validateInput("password", password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      // Llama a la función de login y guarda la respuesta
      const response = await loginUser({ correo: email, contrasena: password });

      // Asegúrate de que 'token' existe antes de intentar acceder a él
      if (response && response.token) {
        // Guarda el token en localStorage o donde prefieras
        localStorage.setItem("token", response.token);

        console.log("Token guardado en localStorage:", localStorage.getItem("token"));
        // Muestra la alerta de éxito
        toast.success("¡Inicio de sesión exitoso!");

        // Retrasa la redirección 3 segundos después de mostrar la alerta
        setTimeout(() => {
          navigate("/Bienvenida");
        }, 3000); // 3000 ms = 3 segundos

      } else {
        toast.error("Respuesta inválida del servidor.");
      }
    } catch (error) {
      // Si el error es debido a un usuario no registrado
      if(error.response.data.statusCode === 500){
        toast.error("Usuario no registrado. Por favor, verifica tu información.");
      }
    }
  };


  // Alterna la visibilidad de la contraseña.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
    <div className="form-container">
      <div className="form-card">
        {/* Componente para mostrar el rastro de navegación */}

        <h1 className="form-title">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo de correo electrónico */}
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
              className={`form-input`}
            />
            {errors.email && (
              <p className="textError">
                <FiXCircle className="iconoError" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className="form-group relative">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingresa tu contraseña"
              className={`form-input`}
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
                <FiXCircle className="iconoError" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <button type="submit" className="btn-aceptar">
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
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