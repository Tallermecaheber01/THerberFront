import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import Breadcrumbs from '../Breadcrumbs';

import {
  sendPasswordResetVerificationCode,
  verifyPasswordResetCode,
  resetPassword,
} from '../../api/public';

function Recuperacion() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
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

  const navigate = useNavigate();

  const breadcrumbPaths = [
    { name: 'Inicio', link: '/' },
    { name: 'Login', link: '/login' },
    { name: 'Recuperación', link: '/recuperacion' },
  ];

  // Función para validar los campos
  const validateInput = (name, value) => {
    let error = '';

    switch (name) {
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
      case 'newPassword':
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
            value
          )
        ) {
          error =
            'La contraseña debe tener 8-20 caracteres, con al menos un símbolo, una mayúscula, una minúscula y un número.';
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
    const error = validateInput(name, value.trim());
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Manejar el evento onChange para actualizar los estados
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'verificationCode') setVerificationCode(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Enviar el código de verificación
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateInput('email', email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      await sendPasswordResetVerificationCode(email);
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
    const newPasswordError = validateInput('newPassword', newPassword);
    const confirmPasswordError = validateInput('confirmPassword', confirmPassword);

    if (newPasswordError || confirmPasswordError) {
      setErrors({
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
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
    setEmail('');
    setVerificationCode('');
    setErrors((prev) => ({ ...prev, email: '' }));
    setShowNewInputs(false);
    setShowVerificationInput(false);
  };

  // Mostrar/ocultar contraseña
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <Breadcrumbs paths={breadcrumbPaths} />
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Recuperación de Contraseña</h1>
          <form onSubmit={handleSubmit}>
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
                  Aceptar
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
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Recuperacion;