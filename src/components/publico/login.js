import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Iniciar Sesión</h1>
        <form>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              className="form-input"
            />
          </div>

          <button type="submit" className="button-yellow">
            Iniciar Sesión
          </button>
        </form>

        <div className="form-footer">
          <Link to="/recuperacion" className="form-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
