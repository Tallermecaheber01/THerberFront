import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function CarModelSelect() {
  const [marca, setMarca] = useState(""); // Marca ingresada
  const [modelos, setModelos] = useState([]); // Modelos obtenidos de la API
  const [busqueda, setBusqueda] = useState(""); // Texto para filtrar modelos
  const [modeloSeleccionado, setModeloSeleccionado] = useState(""); // Modelo elegido
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const sugerenciasRef = useRef(null);

  useEffect(() => {
    if (marca.trim() !== "") {
      axios
        .get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${marca}?format=json`
        )
        .then((response) => {
          setModelos(response.data.Results);
          setMostrarSugerencias(true);
          setBusqueda(""); 
          setModeloSeleccionado("");
        })
        .catch((error) => {
          console.error("Error al obtener los modelos:", error);
        });
    } else {
      setModelos([]);
      setMostrarSugerencias(false);
      setBusqueda("");
      setModeloSeleccionado("");
    }
  }, [marca]);
  const modelosFiltrados = modelos.filter((modelo) =>
    modelo.Model_Name.toLowerCase().includes(busqueda.toLowerCase())
  );
  const handleSeleccion = (modelName) => {
    setModeloSeleccionado(modelName);
    setBusqueda(modelName);
    setMostrarSugerencias(false);
  };
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 relative">
      <h1 className="text-xl font-bold mb-4">Seleccionar Modelo de Auto</h1>
      
      {/* Campo para ingresar la marca */}
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="marca">
          Ingresa la marca:
        </label>
        <input
          id="marca"
          type="text"
          placeholder="Ej: Toyota"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      {modelos.length > 0 && (
        <div className="mb-4" ref={sugerenciasRef}>
          <label className="block mb-1 font-medium" htmlFor="modelo">
            Busca y selecciona un modelo:
          </label>
          <input
            id="modelo"
            type="text"
            placeholder="Escribe para filtrar..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarSugerencias(true);
            }}
            className="w-full border p-2 rounded"
          />
          {/* Lista desplegable con los modelos filtrados */}
          {mostrarSugerencias && (
            <ul className="border border-t-0 absolute z-10 bg-white w-full max-h-60 overflow-auto">
              {modelosFiltrados.length > 0 ? (
                modelosFiltrados.map((modelo) => (
                  <li
                    key={modelo.Model_ID}
                    onClick={() => handleSeleccion(modelo.Model_Name)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {modelo.Model_Name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No se encontraron resultados</li>
              )}
            </ul>
          )}
        </div>
      )}
      {modeloSeleccionado && (
        <p className="mt-2 text-green-600">
          Modelo seleccionado: <strong>{modeloSeleccionado}</strong>
        </p>
      )}
    </div>
  );
}
