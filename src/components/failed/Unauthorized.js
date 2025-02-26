import React from 'react';
import { FaUserLock, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="containerError">
      <div className="CardError">
        <FaUserLock className="iconoerror" />
        <h1 className="erroresTitle">401</h1>
        <p className="erroresSubtitle">Acceso No Autorizado</p>
        <p className="erroresDescription">
          No tienes permisos para acceder a esta página. Verifica tus
          credenciales o consulta con el administrador.
        </p>
        <Link to="/" className="btnerror">
          <FaHome className="mr-2" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
