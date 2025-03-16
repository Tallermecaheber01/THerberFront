// router.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Componentes Públicos
import Home from './components/publico/Home';
import Registro from './components/publico/Registro';
import Login from './components/publico/Login';
import ConsultaServicios from './components/publico/ConsultaServicios';
import Recuperacion from './components/publico/Recuperacion';
import VerDetalles from './components/publico/VerDetalles';
import AcercaDe from './components/publico/AcercaDe';
import PoliticaDePrivacidad from './components/publico/PoliticaDePrivacidad';
import TerminosYCondiciones from './components/publico/TerminosYCondiciones';
import ValidacionCuenta from './components/publico/ValidacionCuenta';
import Marcas from './components/publico/Marcas';

// Páginas de error
import PageNotFound from './components/failed/PageNotFound';
import InternalServerError from './components/failed/InternalServerError';
import Unauthorized from './components/failed/Unauthorized';
import BadRequest from './components/failed/BadRequest';

// Componentes para Usuarios (Client)
import AtencionCliente from './components/usuario/AtencionClientes';
import ConsultaCita from './components/usuario/ConsultaCita';
import Feedback from './components/usuario/Feedback';
import HistorialReparaciones from './components/usuario/HistorialReparaciones';
import NuevoVehiculo from './components/usuario/NuevoVehiculo';
import AgregarCita from './components/usuario/AgregarCita';
import CambiarCita from './components/usuario/CambiarCita';
import Bienvenida from './components/usuario/Bienvenida';

// Componentes para Empleados
import AprobacionCitas from './components/autorizado/AprobacionCitas';
import AsignacionCita from './components/autorizado/AsignacionCitas';
import ConsultaCitas from './components/autorizado/ConsultaCitas';
import RegistroReparaciones from './components/autorizado/RegistroReparacion';
import CitasCanceladas from './components/autorizado/CitasCanceladas';
import ConsultasReparaciones from './components/autorizado/ConsultasReparaciones';

// Componentes para Administradores
import AnalisisRendimiento from './components/admin/AnalisisRendimiento';
import CrudRegulatorios from './components/admin/CrudDocRegulatorios';
import CrudServicios from './components/admin/CrudServicios';
import DatosEstadisticos from './components/admin/DatosEstadisticos';
import GestionFinanciera from './components/admin/GestionFinanciera';
import CrudReparaciones from './components/admin/CrudReparaciones';
import Demandas from './components/admin/Demandas';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="registro" element={<Registro />} />
      <Route path="login" element={<Login />} />
      <Route path="consultaservicios" element={<ConsultaServicios />} />
      <Route path="recuperacion" element={<Recuperacion />} />
      <Route path="verDetalles/:id" element={<VerDetalles />} />
      <Route path="acercade" element={<AcercaDe />} />
      <Route path="politicadeprivacidad" element={<PoliticaDePrivacidad />} />
      <Route path="terminosycondiciones" element={<TerminosYCondiciones />} />
      <Route path="validacioncuenta" element={<ValidacionCuenta />} />
      <Route path="Marcas" element={<Marcas />} />

      {/* Páginas de error */}
      <Route path="NotFound" element={<PageNotFound />} />
      <Route path="500" element={<InternalServerError />} />
      <Route path="403" element={<Unauthorized />} />
      <Route path="400" element={<BadRequest />} />

      {/* Rutas protegidas para Usuarios (Client) */}
      <Route
        path="atencioncliente"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <AtencionCliente />
          </ProtectedRoute>
        }
      />
      <Route
        path="consultacita"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ConsultaCita />
          </ProtectedRoute>
        }
      />
      <Route
        path="feedback"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="historialreparaciones"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <HistorialReparaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="nuevovehiculo"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <NuevoVehiculo />
          </ProtectedRoute>
        }
      />
      <Route
        path="agregarcita"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <AgregarCita />
          </ProtectedRoute>
        }
      />
      <Route
        path="cambiarcita"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <CambiarCita />
          </ProtectedRoute>
        }
      />
      <Route
        path="Bienvenida"
        element={
          <ProtectedRoute allowedRoles={['empleado', 'admin', 'client']}>
            <Bienvenida />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para Empleados */}
      <Route
        path="aprobacioncitas"
        element={
          <ProtectedRoute allowedRoles={['empleado']}>
            <AprobacionCitas />
          </ProtectedRoute>
        }
      />
      <Route
        path="asignacioncita"
        element={
          <ProtectedRoute allowedRoles={['empleado']}>
            <AsignacionCita />
          </ProtectedRoute>
        }
      />
      <Route
        path="consultacitas"
        element={
          <ProtectedRoute allowedRoles={['empleado']}>
            <ConsultaCitas />
          </ProtectedRoute>
        }
      />
      <Route
        path="registroreparaciones"
        element={
            <RegistroReparaciones />
          
        }
      />
      <Route
        path="citasCanceladas"
        element={
          <ProtectedRoute allowedRoles={['empleado']}>
            <CitasCanceladas />
          </ProtectedRoute>
        }
      />
      <Route
        path="consultasreparaciones"
        element={
          <ProtectedRoute allowedRoles={['empleado']}>
            <ConsultasReparaciones />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para Administradores */}
      <Route
        path="analisisrendimiento"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AnalisisRendimiento />
          </ProtectedRoute>
        }
      />
      <Route
        path="crudregulatorios"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CrudRegulatorios />
          </ProtectedRoute>
        }
      />
      <Route
        path="crudservicios"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CrudServicios />
          </ProtectedRoute>
        }
      />
      <Route
        path="datosestadisticos"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DatosEstadisticos />
          </ProtectedRoute>
        }
      />
      <Route
        path="gestionfinanciera"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <GestionFinanciera />
          </ProtectedRoute>
        }
      />
      <Route
        path="crudreparaciones"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CrudReparaciones />
          </ProtectedRoute>
        }
      />

      <Route
        path="demandas"
        element={
            <Demandas/>
        }
      />

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<Navigate to="/NotFound" replace />} />
    </Routes>
  );
};

export default AppRoutes;
