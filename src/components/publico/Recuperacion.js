// Importamos las bibliotecas necesarias de React y React Router
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Hook para redirigir entre rutas
import { FiXCircle, FiEye, FiEyeOff } from "react-icons/fi"; // Iconos para mostrar errores y alternar la visibilidad de las contraseñas
import Breadcrumbs from "../Breadcrumbs"; // Componente que muestra la navegación tipo "migas de pan" (breadcrumbs)
import { sendVerificationCode, verifyCode, resetPassword } from "../../api/users";

// Definimos el componente principal "Recuperacion"
function Recuperacion() {
  // Definimos los estados para manejar los valores del formulario y los errores
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Estado para la nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar la contraseña
  const [errors, setErrors] = useState({ // Estado para manejar los errores de validación
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false); // Estado para alternar la visibilidad de la nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para alternar la visibilidad de la confirmación de la contraseña
  const [showNewInputs, setShowNewInputs] = useState(false); // Estado para mostrar u ocultar los campos de nueva contraseña
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate(); // Hook para redirigir a otras rutas

  // Array que define las rutas para las migas de pan
  const breadcrumbPaths = [
    { name: "Inicio", link: "/" }, // Ruta al inicio
    { name: "Login", link: "/login" }, // Ruta al login
    { name: "Recuperación", link: "/recuperacion" }, // Ruta actual
  ];

  // Función para validar la entrada del usuario según el campo
  const validateInput = (name, value) => {
    let error = ""; // Inicializamos el mensaje de error vacío

    switch (name) {
      case "email": // Validación para el correo electrónico
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value.length < 12) {
          error = "Correo inválido. Debe tener al menos 12 caracteres y un @."; // Mensaje de error si no cumple
        }
        break;
      case "newPassword": // Validación para la nueva contraseña
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(value)) {
          error = "Contraseña de 8-20 caracteres, con al menos un símbolo, mayúscula, minúscula y número."; // Mensaje de error
        }
        break;
      case "confirmPassword": // Validación para confirmar la contraseña
        if (value !== newPassword) {
          error = "Las contraseñas no coinciden."; // Mensaje si las contraseñas no son iguales
        }
        break;
      default:
        break;
    }

    return error; // Devolvemos el mensaje de error (si existe)
  };

  // Maneja el evento cuando el usuario deja de enfocar un campo
  const handleBlur = (e) => {
    const { name, value } = e.target; // Obtenemos el nombre y valor del campo
    const error = validateInput(name, value.trim()); // Validamos el valor del campo
    setErrors((prev) => ({ ...prev, [name]: error })); // Actualizamos los errores
  };

  // Maneja el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target; // Obtenemos el nombre y valor del campo
    if (name === "email") setEmail(value); // Actualizamos el correo
    if (name === "verificationCode") setVerificationCode(value);
    if (name === "newPassword") setNewPassword(value); // Actualizamos la nueva contraseña
    if (name === "confirmPassword") setConfirmPassword(value); // Actualizamos la confirmación

    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpiamos el error de este campo
  };

  // Maneja el envío del formulario para verificar el correo electrónico
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const emailError = validateInput("email", email); // Validamos el correo

    if (emailError) {
      setErrors({ email: emailError }); // Si hay error, actualizamos los errores
      return;
    }

    try {
      await sendVerificationCode(email);
      toast.success("¡Codigo para recuperar tu contraseña ha sido enviado!");
      setShowVerificationInput(true);
      setIsEmailVerified(true);
    } catch (error) {
       toast.error("Error al enviar el codigo", {
              position: "top-right",
              autoClose: 3000,
            });
      console.log("Error al enviar el codigo:", error)
      setErrors((prev) => ({ ...prev, email: "Hubo un error al enviar el código." }));
    }

  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const verificationCodeError = validateInput("verificationCode", verificationCode);
    if (verificationCodeError) {
      setErrors({ verificationCode: verificationCodeError });
      return;
    }

    try {
      //Verifica l codigo de verificacion
      await verifyCode(email, verificationCode);
      toast.success("¡Codigo verificado correctamente!");
      setShowNewInputs(true); // Si el código es válido, muestra los campos para la nueva contraseña
    } catch (error) {
      toast.error("Error al verificar el código", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error al verificar el código:", error);
      setErrors({ verificationCode: "Error al verificar el código. Intenta de nuevo." });
    }

  }

  // Maneja el envío del formulario con la nueva contraseña
  const handleModalSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Validamos las contraseñas
    const newPasswordError = validateInput("newPassword", newPassword);
    const confirmPasswordError = validateInput("confirmPassword", confirmPassword);

    if (newPasswordError || confirmPasswordError) {
      setErrors({ newPassword: newPasswordError, confirmPassword: confirmPasswordError }); // Si hay errores, los mostramos
      return;
    }

    try {
      await resetPassword(email, newPassword);
      console.log("Contraseña cambiada correctamente");
      toast.success("Contraseña cambiada correctamente");
           setTimeout(() => {
             navigate('/login');
           }, 3000);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Error al cambiar la contraseña. Intenta nuevamente.", {
              position: "top-right",
              autoClose: 3000,
            });
      setErrors({ newPassword: "Error al cambiar la contraseña. Intenta nuevamente." });
    }




  };

  // Maneja el botón "Cancelar", limpiando los campos y errores
  const handleCancel = () => {
    setEmail(""); // Limpiamos el correo
    setVerificationCode("");
    setErrors((prev) => ({ ...prev, email: "" })); // Limpiamos los errores
    setShowNewInputs(false); // Ocultamos los campos de contraseñas
    setShowVerificationInput(false);
  };

  // Alterna la visibilidad de la nueva contraseña
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Alterna la visibilidad de la confirmación de la contraseña
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Renderiza el componente
  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Recuperación de Contraseña</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo para el correo */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
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
              disabled={isEmailVerified}
            />
            {/* Mostrar error si existe */}
            {errors.email && (
              <p className="textError">
                <FiXCircle className="iconoError" />
                {errors.email}
              </p>
            )}
          </div>

          {showVerificationInput && (
            <div className="form-group">
              <label htmlFor="verificationCode" className="form-label">Código de Verificación</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingresa el código de verificación"
                className="form-input"
              />
              {errors.verificationCode && (
                <p className="textError">
                  <FiXCircle className="iconoError" />
                  {errors.verificationCode}
                </p>
              )}
            </div>
          )}

          {/* Campos para contraseñas si están habilitados */}
          {showNewInputs && (
            <>
              <div className="form-group relative">
                <label htmlFor="newPassword" className="form-label">
                  Nueva Contraseña
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ingresa tu nueva contraseña"
                  className="form-input"
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-9"
                >
                  {showNewPassword ? <FiEyeOff className="iconoVer" /> : <FiEye className="iconoVer" />}
                </button>
                {/* Mostrar error si existe */}
                {errors.newPassword && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Campo para confirmar la contraseña */}
              <div className="form-group relative">
                <label htmlFor="confirmPassword" className="form-label">
                  Repetir Contraseña
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Repite tu nueva contraseña"
                  className="form-input"
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-9"
                >
                  {showConfirmPassword ? <FiEyeOff className="iconoVer" /> : <FiEye className="iconoVer" />}
                </button>
                {/* Mostrar error si existe */}
                {errors.confirmPassword && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Botones para aceptar o cancelar */}
          <div className="form-group flex gap-4 mt-4">
            {showNewInputs ? (
              <button type="button" className="btn-aceptar" onClick={handleModalSubmit}>
                Aceptar
              </button>
            ) : showVerificationInput ? (
              <button type="button" className="btn-aceptar" onClick={handleVerificationSubmit}>
                Verificar Código
              </button>
            ) : (
              <button type="submit" className="btn-aceptar">
                Aceptar
              </button>
            )}
            <button type="button" className="btn-cancelar" onClick={handleCancel}>
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

export default Recuperacion; // Exportamos el componente para que pueda ser usado en otros archivos
