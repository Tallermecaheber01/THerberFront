import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Público
import Registro from './components/publico/Registro';
import Login from './components/publico/Login';
import ConsultaServicios from './components/publico/ConsultaServicios';
import Home from './components/publico/Home';
import Recuperacion from './components/publico/Recuperacion';
import VerDetalles from './components/publico/VerDetalles';
import PageNotFound from './components/failed/PageNotFound';
import InternalServerError from './components/failed/InternalServerError';
import Unauthorized from './components/failed/Unauthorized';
import BadRequest from './components/failed/BadRequest';
import AcercaDe from './components/publico/AcercaDe';
import PoliticaDePrivacidad from './components/publico/PoliticaDePrivacidad';
import TerminosYCondiciones from './components/publico/TerminosYCondiciones';
import ValidacionCuenta from './components/publico/ValidacionCuenta';
import Marcas from './components/publico/Marcas';
// Usuarios
import AtencionCliente from './components/usuario/AtencionClientes';
import ConsultaCita from './components/usuario/ConsultaCita';
import Feedback from './components/usuario/Feedback';
import HistorialReparaciones from './components/usuario/HistorialReparaciones';
import NuevoVehiculo from './components/usuario/NuevoVehiculo';
import AgregarCita from './components/usuario/AgregarCita';
import CambiarCita from './components/usuario/CambiarCita';

// Empleados
import AprobacionCitas from './components/autorizado/AprobacionCitas';
import AsignacionCita from './components/autorizado/AsignacionCitas';
import ConsultaCitas from './components/autorizado/ConsultaCitas';
import RegistroReparaciones from './components/autorizado/RegistroReparacion';
import CitasCanceladas from './components/autorizado/CitasCanceladas';
import ConsultasReparaciones from './components/autorizado/ConsultasReparaciones';

// Administrador
import AnalisisRendimiento from './components/admin/AnalisisRendimiento';
import CrudRegulatorios from './components/admin/CrudDocRegulatorios';
import CrudServicios from './components/admin/CrudServicios';
import DatosEstadisticos from './components/admin/DatosEstadisticos';
import GestionFinanciera from './components/admin/GestionFinanciera';
import CrudReparaciones from './components/admin/CrudReparaciones';

import Bienvenida from './components/usuario/Bienvenida';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Publico */}
      <Route path="/" element={<Home />} />
      <Route path="registro" element={<Registro />} />
      <Route path="login" element={<Login />} />
      <Route path="consultaservicios" element={<ConsultaServicios />} />
      <Route path="recuperacion" element={<Recuperacion />} />
      <Route path="verDetalles/:id" element={<VerDetalles />} />
      <Route path="NotFound" element={<PageNotFound />} />
      <Route path="500" element={<InternalServerError />} />
      <Route path="403" element={<Unauthorized />} />
      <Route path="400" element={<BadRequest />} />
      <Route path="acercade" element={<AcercaDe />} />
      <Route path="politicadeprivacidad" element={<PoliticaDePrivacidad />} />
      <Route path="terminosycondiciones" element={<TerminosYCondiciones />} />
      <Route path="validacioncuenta" element={<ValidacionCuenta />} />
      <Route path="Marcas" element={<Marcas/>} />

      {/* usuarios */}
      <Route path="atencioncliente" element={<AtencionCliente />} />
      <Route path="consultacita" element={<ConsultaCita />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="historialreparaciones" element={<HistorialReparaciones />} />
      <Route path="nuevovehiculo" element={<NuevoVehiculo />} />
      <Route path="agregarcita" element={<AgregarCita />} />
      <Route path="cambiarcita" element={<CambiarCita />} />

      <Route path="Bienvenida" element={<Bienvenida />} />

      {/* empleados */}
      <Route path="aprobacioncitas" element={<AprobacionCitas />} />
      <Route path="asignacioncita" element={<AsignacionCita />} />
      <Route path="consultacitas" element={<ConsultaCitas />} />
      <Route path="registroreparaciones" element={<RegistroReparaciones />} />
      <Route path="citasCanceladas" element={<CitasCanceladas />} />
      <Route path="consultasreparaciones" element={<ConsultasReparaciones />} />

      {/* administradores */}
      <Route path="analisisrendimiento" element={<AnalisisRendimiento />} />
      <Route path="crudregulatorios" element={<CrudRegulatorios />} />
      <Route path="crudservicios" element={<CrudServicios />} />
      <Route path="datosestadisticos" element={<DatosEstadisticos />} />
      <Route path="gestionfinanciera" element={<GestionFinanciera />} />
      <Route path="crudreparaciones" element={<CrudReparaciones />} />
      {/*Esto concatena para paginas no encontradas*/}
      <Route path="*" element={<Navigate to="/NotFound" />} />
    </Routes>
  );
};

export default AppRoutes;
