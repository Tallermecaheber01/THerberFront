import React from "react";
import { Route, Routes } from "react-router-dom";

// Público
import Registro from "./components/publico/registro";
import Login from "./components/publico/login";
import ConsultaServicios from "./components/publico/consulta_servicios";
import Home from "./components/publico/home";
import Recuperacion from "./components/publico/recuperacion";

// Usuarios
import AtencionCliente from "./components/usuario/atencion_cliente";
import ConsultaCita from "./components/usuario/Consulta_cita";
import Feedback from "./components/usuario/Feedback";
import HistorialReparaciones from "./components/usuario/historial_reparaciones";
import NuevoVehiculo from "./components/usuario/nuevo_vehiculo";

// Empleados
import AprobacionCitas from "./components/autorizado/aprobaciones_citas";
import AsignacionCita from "./components/autorizado/asignacion_cita";
import ConsultaCitas from "./components/autorizado/consulta_citas";
import RegistroReparaciones from "./components/autorizado/registro_reparacion";

// Administrador
import AnalisisRendimiento from "./components/admin/analisis_rendimiento";
import CrudRegulatorios from "./components/admin/crud_docregulatorios";
import CrudServicios from "./components/admin/crud_servicios";
import DatosEstadisticos from "./components/admin/datos_estadisticos";
import GestionFinanciera from "./components/admin/gestion_financiera";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Publico */}
      <Route path="/" element={<Home />} />
      <Route path="registro" element={<Registro />} />
      <Route path="login" element={<Login />} />
      <Route path="consultaservicios" element={<ConsultaServicios />} />
      <Route path="recuperacion" element={<Recuperacion />} />

      {/* usuarios */}
      <Route path="atencioncliente" element={<AtencionCliente />} />
      <Route path="consultacita" element={<ConsultaCita />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="historialreparaciones" element={<HistorialReparaciones />} />
      <Route path="nuevovehiculo" element={<NuevoVehiculo />} />

      {/* empleados */}
      <Route path="aprobacioncitas" element={<AprobacionCitas />} />
      <Route path="asignacioncita" element={<AsignacionCita />} />
      <Route path="consultacitas" element={<ConsultaCitas />} />
      <Route path="registroreparaciones" element={<RegistroReparaciones />} />

      {/* administradores */}
      <Route path="analisisrendimiento" element={<AnalisisRendimiento />} />
      <Route path="crudregulatorios" element={<CrudRegulatorios />} />
      <Route path="crudservicios" element={<CrudServicios />} />
      <Route path="datosestadisticos" element={<DatosEstadisticos />} />
      <Route path="gestionfinanciera" element={<GestionFinanciera />} />
    </Routes>
  );
};

export default AppRoutes;
