import React, { useState, useEffect } from 'react';
import './stylos.css';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { SocialIcon } from 'react-social-icons'; 
import { getAllContacts } from './api/admin';

function Footer() {
  const [theme, setTheme] = useState('light');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getAllContacts();
        // Ensure data is an array, fallback to empty array if not
        setContacts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setContacts([]); // Set empty array on error
      }
    };
    loadContacts();
    const interval = setInterval(loadContacts, 2000);
    return () => clearInterval(interval);
  }, []);

  const contactInfo = (Array.isArray(contacts) ? contacts : []).filter(c => {
    if (!c || !c.nombre) return false; // Guard against invalid contact objects
    const nombre = c.nombre.toLowerCase();
    return (
      nombre === 'correo' ||
      nombre === 'telefono' ||
      nombre === 'dirección' ||
      nombre === 'direccion'
    );
  });

  const socialContacts = (Array.isArray(contacts) ? contacts : []).filter(c => {
    if (!c || !c.nombre) return false; // Guard against invalid contact objects
    const nombre = c.nombre.toLowerCase();
    return (
      nombre !== 'correo' &&
      nombre !== 'telefono' &&
      nombre !== 'dirección' &&
      nombre !== 'direccion'
    );
  });

  const socialLinks = socialContacts.filter(c => c.informacion?.startsWith('http'));
  const socialUser = socialContacts.filter(c => !c.informacion?.startsWith('http'));

  const getSocialIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'facebook':
        return <FaFacebook size={24} />;
      case 'instagram':
        return <FaInstagram size={24} />;
      case 'twitter':
        return <FaTwitter size={24} />;
      default:
        return null;
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div>
      <div className="flex justify-end mt-4 mb-4 mr-4">
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
        </button>
      </div>
      <footer className="footer">
        <div className="footerContainer">
          <div className="gridContainer">
            <div>
              <h3 className="subtitlefooter">Navegación</h3>
              <ul>
                <li>
                  <a href="politicadeprivacidad" className="navbar-link">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="terminosycondiciones" className="navbar-link">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="acercade" className="navbar-link">
                    Acerca De
                  </a>
                </li>
                <li>
                  <a href="deslinde" className="navbar-link">
                    Deslinde
                  </a>
                </li>
                <li>
                  <a href="politicaSeguridad" className="navbar-link">
                    Políticas de Seguridad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="subtitlefooter">Contacto</h3>
              <ul>
                {contactInfo.length > 0 ? (
                  contactInfo.map((c) => {
                    const lowerName = c.nombre.toLowerCase();
                    let icon = null;
                    if (lowerName === 'correo') {
                      icon = <FaEnvelope />;
                    } else if (lowerName === 'telefono') {
                      icon = <FaPhone />;
                    }

                    return (
                      <li key={c.id} style={{ marginBottom: '0.5rem' }}>
                        <div className="flex items-center">
                          {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
                          <span className="navbar-link">{c.nombre}:</span>
                          <span style={{ marginLeft: '0.4rem', color: '#fff' }}>
                            {c.informacion}
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li>No hay información de contacto disponible.</li>
                )}
                {socialUser.length > 0 ? (
                  socialUser.map((c) => (
                    <li key={c.id} style={{ marginBottom: '0.5rem' }}>
                      <div className="flex items-center">
                        <span style={{ marginRight: '0.5rem' }}>{getSocialIcon(c.nombre)}</span>
                        <span className="navbar-link">{c.nombre}:</span>
                        <span style={{ marginLeft: '0.4rem', color: '#fff' }}>
                          {c.informacion}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No hay redes sociales disponibles.</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="subtitlefooter">Síguenos</h3>
              <div className="flex space-x-4">
                {socialLinks.length > 0 ? (
                  socialLinks.map((c) => (
                    <SocialIcon
                      key={c.id}
                      url={c.informacion}
                      style={{ height: 24, width: 24 }}
                    />
                  ))
                ) : (
                  <p>No hay enlaces de redes sociales disponibles.</p>
                )}
              </div>
              <h3 className="subtitlefooter mt-4">Déjanos saber tu opinión</h3>
              <ul>
                <li>
                  <a href="feedback" className="navbar-link">
                    Comentarios
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500">
              © 2025 Taller automotriz Heber. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;