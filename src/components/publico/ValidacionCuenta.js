import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../../api/users';

function ValidacionCuenta() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const userData = location.state?.userData; 

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (verificationCode === '') {
      toast.error('Por favor ingresa el código de verificación', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      await registerUser(userData);
      toast.success('¡Usuario Registrado correctamente!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error('Error en la verificación', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card mt-6">
        <h2 className="form-title">Verificación</h2>
        <form onSubmit={handleVerificationSubmit}>
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">
              Código de Verificación
            </label>
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
            <button type="submit" className="btn-aceptar">
              Verificar
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ValidacionCuenta;
