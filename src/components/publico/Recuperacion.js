import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiXCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import Breadcrumbs from '../Breadcrumbs';

import {
  getAllQuestions,
  findUser,
  sendPasswordResetVerificationCode,
  verifyPasswordResetCode,
  resetPassword,
} from '../../api/public';




function Recuperacion() {
  const [questions, setQuestions] = useState([]);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityVerified, setSecurityVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    securityQuestion: '',
    securityAnswer: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewInputs, setShowNewInputs] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    noSequence: false,
  });


  const navigate = useNavigate();

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Login', link: '/login' },
    { name: 'Recuperación', link: '/recuperacion' },
  ];

  const fetchData = async () => {
    try {
      const questionResponse = await getAllQuestions();
      console.log("Preguntas obtenidas:", questionResponse);
      setQuestions(questionResponse);
    } catch (error) {
      console.error("Error al obtener los datos:", error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Función para validar los campos
  const validateInput = (name, value) => {
    let error = '';

    switch (name) {
      case 'securityQuestion':
        if (!value) {
          error = 'Seleccione una pregunta secreta.';
        }
        break;
      case 'securityAnswer':
        if (!value.trim()) {
          error = 'La respuesta no puede estar vacía.';
        }
        break;
      case 'email':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = 'Correo inválido. Debe tener un formato válido (ejemplo: usuario@dominio.com).';
        } else if (value.length > 100) {
          error = 'El correo no puede exceder los 100 caracteres.';
        } else if (/['";]/.test(value)) {
          error = 'El correo no puede contener caracteres especiales como comillas o puntos y comas.';
        }
        break;
      case 'verificationCode':
        if (!/^\d{6}$/.test(value)) {
          error = 'El código de verificación debe ser un número de 6 dígitos.';
        }
        break;
      case 'confirmPassword':
        if (value !== newPassword) {
          error = 'Las contraseñas no coinciden.';
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Manejar el evento onBlur para validar los campos
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
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

  // Manejar el evento onChange para actualizar los estados
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') setEmail(value);
    if (name === 'securityQuestion') setSecurityQuestion(value);
    if (name === 'securityAnswer') setSecurityAnswer(value);
    if (name === 'verificationCode') setVerificationCode(value);
    if (name === 'newPassword') {
      if (!showRequirements && value.length > 0) {
        setShowRequirements(true);
      }

      const checks = getPasswordChecks(value);
      setPasswordChecks(checks);

      // 🔹 Siempre actualizamos la contraseña para que el usuario vea lo que escribe
      setNewPassword(value);
    }

    if (name === 'confirmPassword') setConfirmPassword(value);

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Enviar el correo a la Api para saber si existe en la BD
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    const emailError = validateInput('email', email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      const response = await findUser(email); // Llamar a la API para buscar el usuario
      // Verificar si el usuario existe
      if (!response.success) {
        toast.error('El correo no está registrado.');
        return;
      }

      toast.success('Correo verificado correctamente');
      setSecurityQuestion(response.securityQuestion); // Guardamos la pregunta secreta en el estado
      setSecurityVerified(true);
    } catch (error) {
      toast.error('Error verificando usuario. Inténtalo de nuevo.');
      console.error('Error inesperado:', error);
    }
  };



  // Enviar el código de verificación
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateInput('email', email);
    const questionError = validateInput('securityQuestion', securityQuestion);
    const answerError = validateInput('securityAnswer', securityAnswer);

    if (emailError || questionError || answerError) {
      setErrors({
        email: emailError,
        securityQuestion: questionError,
        securityAnswer: answerError,
      });
      return;
    }

    try {

      // Convertir el ID de la pregunta secreta a número
      //const idPreguntaSecreta = Number(securityQuestion);
      await sendPasswordResetVerificationCode(email, securityQuestion.id, securityAnswer);
      toast.success('¡Código para recuperar tu contraseña ha sido enviado!');
      setShowVerificationInput(true);
      setIsEmailVerified(true);
    } catch (error) {
      toast.error('Error al enviar el código. Verifica tu correo e intenta nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error al enviar el código:', error);
      setErrors((prev) => ({
        ...prev,
        email: 'Hubo un error al enviar el código. Verifica tu correo e intenta nuevamente.',
      }));
    }
  };

  // Verificar el código de verificación
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const verificationCodeError = validateInput('verificationCode', verificationCode);
    if (verificationCodeError) {
      setErrors({ verificationCode: verificationCodeError });
      return;
    }

    try {
      await verifyPasswordResetCode(email, verificationCode);
      toast.success('¡Código verificado correctamente!');
      setShowNewInputs(true);
    } catch (error) {
      toast.error('Error al verificar el código', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error al verificar el código:', error);
      setErrors({
        verificationCode: 'Error al verificar el código. Intenta de nuevo.',
      });
    }
  };

  // Cambiar la contraseña
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(passwordChecks).every(Boolean)) {
      toast.error('La contraseña no cumple con todos los requisitos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }



    try {
      await resetPassword(email, newPassword);
      toast.success('Contraseña cambiada correctamente');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error('Error al cambiar la contraseña. Intenta nuevamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setErrors({
        newPassword: 'Error al cambiar la contraseña. Intenta nuevamente.',
      });
    }
  };

  // Cancelar el proceso
  const handleCancel = () => {
    setSecurityQuestion('');
    setSecurityAnswer('');
    setEmail('');
    setVerificationCode('');
    setErrors((prev) => ({
      ...prev,
      securityQuestion: '',
      securityAnswer: '',
      email: '',
    }));
    setShowNewInputs(false);
    setShowVerificationInput(false);
    setSecurityVerified(false);
  };

  // Mostrar/ocultar contraseña
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const totalChecks = Object.values(passwordChecks).filter(Boolean).length;
  const allChecksSatisfied = totalChecks === 6;

  return (
    <div className="pt-20">
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Recuperación de Contraseña</h1>

          {/* Resto del formulario solo se muestra si la pregunta secreta fue verificada */}
          {!securityVerified && (
            <form onSubmit={handleSecuritySubmit}>
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
                {errors.email && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="form-group flex gap-4 mt-4">
                <button type="submit" className="btn-aceptar">
                  Aceptar
                </button>
                <button type="button" className="btn-cancelar" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>


            </form>
          )}

          {/* Sección de Pregunta Secreta */}
          {securityVerified && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="securityQuestion" className="form-label">
                  Pregunta Secreta
                </label>
                <input
                  id="securityQuestion"
                  name="securityQuestion"
                  className="form-input w-full"
                  type="text"
                  value={securityQuestion} // Muestra la pregunta secreta
                  readOnly // Bloquea la edición
                />
                {errors.securityQuestion && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.securityQuestion}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="securityAnswer" className="form-label">
                  Respuesta
                </label>
                <input
                  type="text"
                  id="securityAnswer"
                  name="securityAnswer"
                  value={securityAnswer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ingresa tu respuesta"
                  className="form-input"
                />
                {errors.securityAnswer && (
                  <p className="textError">
                    <FiXCircle className="iconoError" />
                    {errors.securityAnswer}
                  </p>
                )}
              </div>

              {showVerificationInput && (
                <div className="form-group">
                  <label htmlFor="verificationCode" className="form-label">
                    Código de Verificación
                  </label>
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

              {showNewInputs && (
                <>
                  <div className="form-group relative">
                    <label htmlFor="newPassword" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ingresa tu nueva contraseña"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute right-3 top-9"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="iconoVer" />
                      ) : (
                        <FiEye className="iconoVer" />
                      )}
                    </button>
                    {errors.newPassword && (
                      <p className="textError">
                        <FiXCircle className="iconoError" />
                        {errors.newPassword}
                      </p>
                    )}

                    {showRequirements && !allChecksSatisfied && (
                      <div className="requirements-list">
                        <ul className="list-none p-0 m-0">
                          <li className="flex items-center gap-2 mt-5">
                            {passwordChecks.minLength ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className="dark:text-gray-300 ">
                              Mínimo 8 caracteres (máx. 20)
                            </span>
                          </li>
                          <li className="flex items-center gap-2 ">
                            {passwordChecks.upperCase ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className="dark:text-gray-300">Al menos una mayúscula</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {passwordChecks.lowerCase ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className="dark:text-gray-300">Al menos una minúscula</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {passwordChecks.number ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className="dark:text-gray-300">Al menos un número</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {passwordChecks.specialChar ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className="dark:text-gray-300">
                              Al menos un carácter especial (!@#$%^&*)
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            {passwordChecks.noSequence ? (
                              <FiCheckCircle className="iconoCorrect" />
                            ) : (
                              <FiXCircle className="iconoError" />
                            )}
                            <span className=" dark:text-gray-300 ">
                              Sin secuencias obvias como "12345" o "abcd"
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="form-group relative">
                    <label htmlFor="confirmPassword" className="form-label">
                      Repetir Contraseña
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Repite tu nueva contraseña"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-9"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="iconoVer" />
                      ) : (
                        <FiEye className="iconoVer" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="textError">
                        <FiXCircle className="iconoError" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="form-group flex gap-4 mt-4">
                {showNewInputs ? (
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleModalSubmit}
                  >
                    Aceptar
                  </button>
                ) : showVerificationInput ? (
                  <button
                    type="button"
                    className="btn-aceptar"
                    onClick={handleVerificationSubmit}
                  >
                    Verificar Código
                  </button>
                ) : (
                  <button type="submit" className="btn-aceptar">
                    Enviar Respuesta
                  </button>
                )}
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>


            </form>
          )}


        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Recuperacion;
