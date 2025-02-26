import React from 'react';
import { FaWrench, FaCarCrash, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="containerError">
      <div className="CardError">
        <div className="animate-bounce">
          <FaCarCrash className="iconoerror" />
        </div>
        <h1 className="erroresTitle">404</h1>
        <p className="erroresSubtitle">
          ¡Vaya! Parece que el motor falló, esta página no arranca
        </p>
        <p className="erroresDescription">
          La página que buscas no se encuentra. Regresa a buscar otras opciones.
        </p>
        <Link to="/" className="btnerror">
          <FaHome className="mr-2" />
          Volver al inicio
        </Link>
        <div className="absolute top-[-2rem] right-[-3rem] rotate-12"></div>
      </div>
    </div>
  );
}

export default PageNotFound;
