// router.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import TokenWatcher from './components/TokenWatcher';

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
import PoliticaSeguridad from './components/publico/PoliticaSeguridad';
import Deslinde from './components/publico/Deslinde';

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
import Consultavehiculos from './components/usuario/Consultavehiculos';
import PagarReparacion from './payments/PagarReparacion';

// Componentes para Empleados
import AprobacionCitas from './components/autorizado/AprobacionCitas';
import AprobacionCambioCita from './components/autorizado/AprobacionCambioCita';
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
import InformacionEmpresa from './components/admin/InformacionEmpresa';
import Contactos from './components/admin/CrudContactos';
import CrudPoliticas from './components/admin/crudPoliticas';
import AceptarPagoEfectivo from './payments/AceptarPagoEfectivo';
import CrudSettings from './components/admin/CrudTerminos';
import FAQ from './FAQ';
import FAQCrud from './components/admin/FAQCrud';
import CrudQUIZ from './components/admin/CrudQUIZ';


const AppRoutes = () => {
  return (
    <>
      <TokenWatcher />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="registro" element={<Registro />} />
        <Route path="login" element={<Login />} />
        <Route path="consultaservicios" element={<ConsultaServicios />} />
        <Route path="recuperacion" element={<Recuperacion />} />
        <Route path="verDetalles" element={<VerDetalles />} />
        <Route path="acercade" element={<AcercaDe />} />
        <Route path="politicadeprivacidad" element={<PoliticaDePrivacidad />} />
        <Route path="terminosycondiciones" element={<TerminosYCondiciones />} />
        <Route path="validacioncuenta" element={<ValidacionCuenta />} />
        <Route path="Marcas" element={<Marcas />} />
        <Route path="deslinde" element={<Deslinde />} />
        <Route path="politicaSeguridad" element={<PoliticaSeguridad />} />
        <Route path="FAQ" element={<FAQ />} />

        {/* Páginas de error */}
        <Route path="NotFound" element={<PageNotFound />} />
        <Route path="500" element={<InternalServerError />} />
        <Route path="403" element={<Unauthorized />} />
        <Route path="400" element={<BadRequest />} />

        {/* Rutas protegidas para Usuarios (Client) */}
        <Route
          path="atencioncliente"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <AtencionCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="consultacita"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <ConsultaCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="feedback"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="historialreparaciones"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <HistorialReparaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="nuevovehiculo"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <NuevoVehiculo />
            </ProtectedRoute>
          }
        />
        <Route
          path="agregarcita"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <AgregarCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="cambiarcita/:id"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <CambiarCita />
            </ProtectedRoute>
          }
        />


        <Route
          path="consultaVehiculos"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Consultavehiculos />
            </ProtectedRoute>
          }
        />

        <Route
          path="pagarreparacion"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <PagarReparacion />
            </ProtectedRoute>
          }
        />

        <Route path="Bienvenida" element={<Bienvenida />} />

        {/* Rutas protegidas para Empleados */}
        <Route
          path="aprobacioncitas"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <AprobacionCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="aprobacioncambiocita"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <AprobacionCambioCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="asignacioncita"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <AsignacionCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="consultacitas"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <ConsultaCitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="registroreparaciones"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <RegistroReparaciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="citasCanceladas"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <CitasCanceladas />
            </ProtectedRoute>
          }
        />
        <Route
          path="consultasreparaciones"
          element={
            <ProtectedRoute allowedRoles={['empleado', 'administrador']}>
              <ConsultasReparaciones />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para Administradores */}
        <Route
          path="analisisrendimiento"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AnalisisRendimiento />
            </ProtectedRoute>
          }
        />
        <Route
          path="crudregulatorios"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <CrudRegulatorios />
            </ProtectedRoute>
          }
        />
        <Route
          path="crudservicios"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <CrudServicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="datosestadisticos"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <DatosEstadisticos />
            </ProtectedRoute>
          }
        />
        <Route
          path="gestionfinanciera"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <GestionFinanciera />
            </ProtectedRoute>
          }
        />
        <Route
          path="crudreparaciones"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <CrudReparaciones />
            </ProtectedRoute>
          }
        />

        <Route

          path="aceptarpagoefectivo"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AceptarPagoEfectivo />
            </ProtectedRoute>
          }
        />
        <Route
          path="crudTerminos"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <CrudSettings />
            </ProtectedRoute>
          }
        />
        <Route 
        path="demandas" 
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
             <Demandas />
             </ProtectedRoute>
        } />

        <Route
          path="demandas"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Demandas />
            </ProtectedRoute>
          } />

        <Route
          path="informacionempresa"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <InformacionEmpresa />
            </ProtectedRoute>
          }
        />

        <Route
          path="contactos"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Contactos />
            </ProtectedRoute>
          }
        />

        <Route
          path="politicas"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <CrudPoliticas />
            </ProtectedRoute>
          }
        />

        <Route 
          path="faqCRud" 
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <FAQCrud/>
              </ProtectedRoute>
            } 
          /> 

        <Route 
          path="CrudQUIZ" 
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <CrudQUIZ/>
              </ProtectedRoute>
            } 
          />

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
