import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Iconos de redes sociales

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="gridContainer">
          {/* Sección de Navegación */}
          <div>
            <h3 className="subtitlefooter">Navegación</h3>
            <ul>
              <li>
                <a href="PoliticaDePrivacidad" className="navbar-link">Política de Privacidad</a>
              </li>
              <li>
                <a href="TerminosYCondiciones" className="navbar-link">Términos y Condiciones</a>
              </li>
              <li>
                <a href="AcercaDe" className="navbar-link">Acerca De</a>
              </li>
            </ul>
          </div>

          {/* Sección de Contacto */}
          <div>
            <h3 className="subtitlefooter">Contacto</h3>
            <ul>
              <li>
                <p className="resumCita">Correo: tallermecanicoheber@gmail.com</p>
              </li>
              <li>
                <p className="resumCita">Teléfono: +52 7712342721</p>
              </li>
              <li>
                <p className="resumCita">Dirección: Col.Tepeyac</p>
              </li>
            </ul>
          </div>

          {/* Sección de Redes Sociales */}
          <div>
            <h3 className="subtitlefooter">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1EWcqDpwQs/" className="text-blue-600 hover:text-blue-800">
                <FaFacebook size={24} />
              </a>
              <a href="https://x.com/Yolo_adrian07?t=SlJLujbAUpXPKzcuU_jhzg&s=09" className="text-blue-400 hover:text-blue-600">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/yolo_adrian?igsh=MXUxZWhteXR2ZDh1aw==" className="text-pink-500 hover:text-pink-700">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500">© 2025 Taller automotriz Heber. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
