import React from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

function BadRequest() {
  return (
    <div className="containerError">
      <div className="CardError">
        <FaExclamationTriangle className="iconoerror animate-slow-pulse " />
        <h1 className="erroresTitle">400</h1>
        <p className="erroresSubtitle">Solicitud incorrecta</p>
        <p className="erroresDescription">
          Los datos enviados no fueron correctos. Revisa y vuelve a intentarlo, Gracias.
        </p>
        <Link to="/" className="btnerror">
          <FaHome className="mr-2" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default BadRequest;
