import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from './components/AuthContext';
import './stylos.css';

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Dropdown "Citas" para admin
  const [isAdminCitasDropdownOpen, setIsAdminCitasDropdownOpen] = useState(false);
  const [isAdminCitasClicked, setIsAdminCitasClicked] = useState(false);
  const adminCitasDropdownRef = useRef(null);

  // Dropdown "Gestión Empresarial" para admin
  const [isGestDropdownOpen, setIsGestDropdownOpen] = useState(false);
  const [isGestClicked, setIsGestClicked] = useState(false);
  const gestDropdownRef = useRef(null);

  // Dropdown "Documentación" para admin
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [isDocClicked, setIsDocClicked] = useState(false);
  const docDropdownRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Manejo de clicks fuera del dropdown "Citas"
  useEffect(() => {
    const handleClickOutsideCitas = (event) => {
      if (
        adminCitasDropdownRef.current &&
        !adminCitasDropdownRef.current.contains(event.target)
      ) {
        setIsAdminCitasDropdownOpen(false);
        setIsAdminCitasClicked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideCitas);
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideCitas);
  }, []);

  // Manejo de clicks fuera del dropdown "Gestión Empresarial"
  useEffect(() => {
    const handleClickOutsideGest = (event) => {
      if (
        gestDropdownRef.current &&
        !gestDropdownRef.current.contains(event.target)
      ) {
        setIsGestDropdownOpen(false);
        setIsGestClicked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideGest);
    return () => document.removeEventListener('mousedown', handleClickOutsideGest);
  }, []);

  // Manejo de clicks fuera del dropdown "Documentación"
  useEffect(() => {
    const handleClickOutsideDoc = (event) => {
      if (
        docDropdownRef.current &&
        !docDropdownRef.current.contains(event.target)
      ) {
        setIsDocDropdownOpen(false);
        setIsDocClicked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideDoc);
    return () => document.removeEventListener('mousedown', handleClickOutsideDoc);
  }, []);

  const handleLogout = () => {
    // Eliminamos la cookie de autenticación
    document.cookie =
      'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setAuth({ user: null, role: 'publico' });
    navigate('/');
  };

  return (
    <nav
      className={`navbar fixed top-0 w-full z-50 transform transition-transform duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
            {auth?.role === 'publico' && (
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

            {/* Rutas cliente */}
            {auth?.role === 'cliente' && (
              <>
                <li>
                  <Link to="/atencioncliente" className="navbar-link">
                    Atención Cliente
                  </Link>
                </li>
                <li>
                  <Link to="/consultacita" className="navbar-link">
                    Citas próximas
                  </Link>
                </li>
                <li>
                  <Link to="/historialreparaciones" className="navbar-link">
                    Historial de Reparaciones
                  </Link>
                </li>
                 <li>
                  <Link to="/pagarreparacion" className="navbar-link">
                    Pago de Reparacion
                  </Link>
                </li>
                <li>
                  <Link to="/nuevovehiculo" className="navbar-link">
                    Agregar Vehículo
                  </Link>
                </li>
                <li>
                  <Link to="/consultaVehiculos" className="navbar-link">
                    Consulta Vehículo
                  </Link>
                </li>
                <li>
                  <Link to="/consultaservicios" className="navbar-link">
                    Catálogo Servicios
                  </Link>
                </li>
              </>
            )}

            {/* Rutas empleado */}
            {auth?.role === 'empleado' && (
              <>
                {/* Dropdown "Citas" para empleado */}
                <li className="relative" ref={adminCitasDropdownRef}>
                  <span
                    className="navbar-link cursor-pointer"
                    onMouseEnter={() => setIsAdminCitasDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!isAdminCitasClicked)
                        setIsAdminCitasDropdownOpen(false);
                    }}
                    onClick={() =>
                      setIsAdminCitasClicked((prev) => {
                        const newState = !prev;
                        setIsAdminCitasDropdownOpen(newState);
                        return newState;
                      })
                    }
                  >
                    Citas
                  </span>
                  {isAdminCitasDropdownOpen && (
                    <ul
                      className="navbar-dropdown"
                      onMouseEnter={() => setIsAdminCitasDropdownOpen(true)}
                      onMouseLeave={() => {
                        if (!isAdminCitasClicked)
                          setIsAdminCitasDropdownOpen(false);
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

            {/* Rutas administrador */}
            {auth?.role === 'administrador' && (
              <>
                {/* Dropdown "Citas" */}
                <li className="relative" ref={adminCitasDropdownRef}>
                  <span
                    className="navbar-link cursor-pointer"
                    onMouseEnter={() => setIsAdminCitasDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!isAdminCitasClicked)
                        setIsAdminCitasDropdownOpen(false);
                    }}
                    onClick={() =>
                      setIsAdminCitasClicked((prev) => {
                        const newState = !prev;
                        setIsAdminCitasDropdownOpen(newState);
                        return newState;
                      })
                    }
                  >
                    Citas
                  </span>
                  {isAdminCitasDropdownOpen && (
                    <ul
                      className="navbar-dropdown"
                      onMouseEnter={() => setIsAdminCitasDropdownOpen(true)}
                      onMouseLeave={() => {
                        if (!isAdminCitasClicked)
                          setIsAdminCitasDropdownOpen(false);
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
                          to="/aprobacioncambiocita"
                          className="navbar-dropdown-text"
                        >
                          Aprobacion cambio de cita
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

                {/* Dropdown "Gestión Empresarial" */}
                <li className="relative" ref={gestDropdownRef}>
                  <span
                    className="navbar-link cursor-pointer"
                    onMouseEnter={() => setIsGestDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!isGestClicked) setIsGestDropdownOpen(false);
                    }}
                    onClick={() =>
                      setIsGestClicked((prev) => {
                        const newState = !prev;
                        setIsGestDropdownOpen(newState);
                        return newState;
                      })
                    }
                  >
                    Demandas empresa
                  </span>
                  {isGestDropdownOpen && (
                    <ul
                      className="navbar-dropdown"
                      onMouseEnter={() => setIsGestDropdownOpen(true)}
                      onMouseLeave={() => {
                        if (!isGestClicked) setIsGestDropdownOpen(false);
                      }}
                    >
                      <li>
                        <Link
                          to="/analisisrendimiento"
                          className="navbar-dropdown-text"
                        >
                          Rendimiento
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/datosestadisticos"
                          className="navbar-dropdown-text"
                        >
                          Datos Estadísticos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/gestionfinanciera"
                          className="navbar-dropdown-text"
                        >
                          Gestión Financiera
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/demandas"
                          className="navbar-dropdown-text"
                        >
                          Demandas
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Dropdown "Documentación" */}
                <li className="relative" ref={docDropdownRef}>
                  <span
                    className="navbar-link cursor-pointer"
                    onMouseEnter={() => setIsDocDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!isDocClicked) setIsDocDropdownOpen(false);
                    }}
                    onClick={() =>
                      setIsDocClicked((prev) => {
                        const newState = !prev;
                        setIsDocDropdownOpen(newState);
                        return newState;
                      })
                    }
                  >
                    Informacion Empresa
                  </span>
                  {isDocDropdownOpen && (
                    <ul
                      className="navbar-dropdown"
                      onMouseEnter={() => setIsDocDropdownOpen(true)}
                      onMouseLeave={() => {
                        if (!isDocClicked) setIsDocDropdownOpen(false);
                      }}
                    >
                      <li>
                        <Link
                          to="/crudregulatorios"
                          className="navbar-dropdown-text"
                        >
                          Documentos Regulatorios
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contactos"
                          className="navbar-dropdown-text"
                        >
                          Contactos
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/informacionempresa"
                          className="navbar-dropdown-text"
                        >
                          Información Empresa
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/politicas"
                          className="navbar-dropdown-text"
                        >
                          Politicas
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Otra ruta fija para administrador */}
                <li>
                  <Link to="/crudservicios" className="navbar-link">
                    Servicios
                  </Link>
                </li>

                <li>
                  <Link to="/consultasreparaciones" className="navbar-link">
                    Reparaciones realizadas
                  </Link>
                </li>
                <li>
                  <Link to="/aceptarpagoefectivo" className="navbar-link">
                    Aceptar Efectivo
                  </Link>
                </li>

              </>
            )}
          </ul>

          {/* Botón de logout visible para usuarios autenticados */}
          {auth?.role !== 'publico' && (
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


