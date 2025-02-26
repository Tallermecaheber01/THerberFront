import React from 'react';
import { FaTools, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function InternalServerError() {
  return (
    <div className="containerError">
      <div className="CardError">
        <FaTools className="iconoerror animate-slow-spin" />
        <h1 className="erroresTitle">500</h1>
        <p className="erroresSubtitle">¡Algo salió mal en el taller!</p>
        <p className="erroresDescription">
          El servidor está sobrecalentado. Estamos haciendo una revisión. Por
          favor, intenta más tarde.
        </p>
        <Link to="/" className="btnerror">
          <FaHome className="mr-2" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default InternalServerError;
