import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Navbar from "./nanvar";
import AppRoutes from "./routes"; // Importa el archivo de rutas

function App() {
  return (
    <Router>
      {/* Navbar siempre presente */}
      <Navbar />

      {/* Aquí se renderizan todas las rutas desde el archivo separado */}
      <AppRoutes />
    </Router>
  );
}

export default App;
