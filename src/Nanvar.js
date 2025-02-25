import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Icono de cerrar sesión
import "./stylos.css";  

const Navbar = () => {
  const [userRole, setUserRole] = useState("empleado"); // publico, usuario, empleado, admin
  const navigate = useNavigate();

  // Estados para el dropdown de "Citas"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsDropdownClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserRole("publico"); // Cambia a público
    navigate("/"); // Redirige al home
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-title">
          <div className="navbar-logo">
            <Link to="/">
              <img
                src="/logoTaller.png"
                alt="Logo"
                className="w-[70px] h-[70px] object-contain cursor-pointer"
              />
            </Link>
          </div>
          <div className="navbar-text">
            <h1 className="navbar-title">Taller Heber</h1>
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
                <li>
                  <Link to="/registro" className="navbar-link">
                    Registro
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/consultaservicios" className="navbar-link">
                    Consulta Servicios
                  </Link>
                </li>
              </>
            )}
            {userRole === "usuario" && (
              <>
                <li>
                  <Link to="/atencioncliente" className="navbar-link">
                    Atención Cliente
                  </Link>
                </li>
                <li>
                  <Link to="/consultacita" className="navbar-link">
                    Citas proximas
                  </Link>
                </li>
                <li>
                  <Link to="/historialreparaciones" className="navbar-link">
                    Historial de Reparaciones
                  </Link>
                </li>
                <li>
                  <Link to="/nuevovehiculo" className="navbar-link">
                    Agregar Vehículo
                  </Link>
                </li>
                <li>
                  <Link to="/consultaservicios" className="navbar-link">
                    Catalogo Servicios
                  </Link>
                </li>
              </>
            )}
            {userRole === "empleado" && (
              <>
                {/* Dropdown de "Citas" */}
                <li className="relative" ref={dropdownRef}>
                  <span
                    className="navbar-link cursor-pointer"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!isDropdownClicked) setIsDropdownOpen(false);
                    }}
                    onClick={() =>
                      setIsDropdownClicked((prev) => {
                        const newState = !prev;
                        setIsDropdownOpen(newState);
                        return newState;
                      })
                    }
                  >
                    Citas
                  </span>
                  {isDropdownOpen && (
                    <ul
                      className="navbar-dropdown"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => {
                        if (!isDropdownClicked) setIsDropdownOpen(false);
                      }}
                    >
                      <li>
                        <Link
                          to="/aprobacioncitas"
                          className="navbar-dropdown-text"
                        >
                          Aprobación Citas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/asignacioncita"
                          className="navbar-dropdown-text"
                        >
                          Asignación Cita
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/consultacitas"
                          className="navbar-dropdown-text"
                        >
                          Consulta Citas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/citasCanceladas"
                          className="navbar-dropdown-text"
                        >
                          Citas Canceladas
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link to="/consultasreparaciones" className="navbar-link">
                    Reparaciones realizadas
                  </Link>
                </li>
              </>
            )}
            {userRole === "admin" && (
              <>
                <li>
                  <Link to="/analisisrendimiento" className="navbar-link">
                    Rendimiento
                  </Link>
                </li>
                <li>
                  <Link to="/crudregulatorios" className="navbar-link">
                    Documentos Regulatorios
                  </Link>
                </li>
                <li>
                  <Link to="/crudservicios" className="navbar-link">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to="/datosestadisticos" className="navbar-link">
                    Datos Estadísticos
                  </Link>
                </li>
                <li>
                  <Link to="/gestionfinanciera" className="navbar-link">
                    Gestión Financiera
                  </Link>
                </li>
                <li>
                  <Link to="/crudReparaciones" className="navbar-link">
                    Crud Reparaciones
                  </Link>
                </li>
              </>
            )}
          </ul>
          {userRole !== "publico" && (
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut className="text-red-500 w-6 h-6 cursor-pointer stroke-[2] transition-transform transform hover:scale-125 hover:text-red-700" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
