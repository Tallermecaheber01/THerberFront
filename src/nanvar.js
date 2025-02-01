import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./stylos.css";  

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const userRole = "publico"; // publico, usuario, empleado, admin

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-logo-title">
                <div className="navbar-logo">
                    <img src="/logoTaller.png" alt="Logo" className="w-[50px] h-[60px] object-contain" />
                </div>
                <div className="navbar-text">
                    <h1 className="navbar-title">Taller Herber</h1>
                </div>
            </div>
            <div className="navbar-text">
                <p className="navbar-subtitle">Expertos en motor, aliados de tu motor</p>
            </div>
            <div className="navbar-nav">
                <ul className="navbar-list">
                    {/* Rutas públicas */}
                    {userRole === "publico" && (
                        <>
                        <li><Link to="/" className="navbar-link">Inicio</Link></li>
                        <li><Link to="/registro" className="navbar-link">Registro</Link></li>
                        <li><Link to="/login" className="navbar-link">Login</Link></li>
                        <li><Link to="/consultaservicios" className="navbar-link">Consulta Servicios</Link></li>
                        </>
                    )}
                    {userRole === "usuario" && (
                        <>
                        <li><Link to="/atencioncliente" className="navbar-link">Atención Cliente</Link></li>
                        <li><Link to="/consultacita" className="navbar-link">Consulta Cita</Link></li>
                        <li><Link to="/feedback" className="navbar-link">Feedback</Link></li>
                        <li><Link to="/historialreparaciones" className="navbar-link">Historial Reparaciones</Link></li>
                        <li><Link to="/nuevovehiculo" className="navbar-link">Nuevo Vehículo</Link></li>
                        <li><Link to="/consultaservicios" className="navbar-link">Consulta Servicios</Link></li>
                        </>
                    )}
                    {userRole === "empleado" && (
                        <>
                        <li><Link to="/aprobacioncitas" className="navbar-link">Aprobación Citas</Link></li>
                        <li><Link to="/asignacioncita" className="navbar-link">Asignación Cita</Link></li>
                        <li><Link to="/consultacitas" className="navbar-link">Consulta Citas</Link></li>
                        <li><Link to="/registroreparaciones" className="navbar-link">Registro Reparaciones</Link></li>
                        </>
                    )}
                    {userRole === "admin" && (
                        <>
                        <li><Link to="/analisisrendimiento" className="navbar-link">Rendimiento</Link></li>
                        <li><Link to="/crudregulatorios" className="navbar-link">Documentos Regulatorios</Link></li>
                        <li><Link to="/crudservicios" className="navbar-link">Servicios</Link></li>
                        <li><Link to="/datosestadisticos" className="navbar-link">Datos Estadísticos</Link></li>
                        <li><Link to="/gestionfinanciera" className="navbar-link">Gestión Financiera</Link></li>
                        </>
                    )}
                </ul>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
                </button>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
