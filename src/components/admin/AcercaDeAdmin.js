import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AcercaDe() {
  const [mission, setMission] = useState("Contenido inicial de la Misión");
  const [vision, setVision] = useState("Contenido inicial de la Visión");
  const [values, setValues] = useState("Contenido inicial de los Valores");
  const [activeEditor, setActiveEditor] = useState(null);
  const [tempContent, setTempContent] = useState("");

  // Validación: mínimo 30 caracteres y sólo se permiten letras (incluyendo acentuadas),
  // números, espacios, puntuación básica y los símbolos % y $
  const validateContent = (content) => {
    if (content.trim().length < 30) {
      toast.error("El contenido debe tener al menos 30 caracteres.");
      return false;
    }
    // Permitir letras, números, espacios y puntuación básica, incluyendo % y $
    const allowedPattern = /^[a-zA-Z0-9À-ÿ\s.,:;!?¿¡'"()%\$\-]+$/;
    if (!allowedPattern.test(content)) {
      toast.error("El contenido contiene caracteres especiales no permitidos.");
      return false;
    }
    return true;
  };

  // Abre el editor de la sección indicada, solo si ningún otro está abierto
  const handleEdit = (field) => {
    if (activeEditor !== null) return;
    setActiveEditor(field);
    if (field === 'mission') setTempContent(mission);
    else if (field === 'vision') setTempContent(vision);
    else if (field === 'values') setTempContent(values);
  };

  // Guarda los cambios y cierra el editor, previo chequeo de validación
  const handleSave = () => {
    if (!validateContent(tempContent)) return;
    if (activeEditor === 'mission') {
      setMission(tempContent);
    } else if (activeEditor === 'vision') {
      setVision(tempContent);
    } else if (activeEditor === 'values') {
      setValues(tempContent);
    }
    setActiveEditor(null);
    setTempContent("");
  };

  // Limpia el contenido del editor (opción para eliminar todo el contenido)
  const handleClear = () => {
    setTempContent("");
  };

  // Cierra el editor sin guardar cambios
  const handleCancel = () => {
    setActiveEditor(null);
    setTempContent("");
  };

  // Renderiza la sección o su editor si está activa
  const renderEditor = (field, label, content) => {
    if (activeEditor === field) {
      return (
        <div>
          <textarea 
            value={tempContent} 
            onChange={(e) => setTempContent(e.target.value)}
            rows="5"
            className="form-input mb-2"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-aceptar">Guardar</button>
            <button onClick={handleClear} className="button-yellow">Limpiar por completo</button>
            <button onClick={handleCancel} className="btn-cancelar">Cerrar</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p className="white-text">{content}</p>
        <button 
          onClick={() => handleEdit(field)} 
          disabled={activeEditor !== null} 
          className="btn-aceptar"
        >
          Editar {label}
        </button>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="form-title text-center mb-4">Acerca De</h2>
      <div className="mb-4 p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Misión</h3>
        {renderEditor('mission', 'Misión', mission)}
      </div>
      <div className="mb-4 p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Visión</h3>
        {renderEditor('vision', 'Visión', vision)}
      </div>
      <div className="p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Valores</h3>
        {renderEditor('values', 'Valores', values)}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AcercaDe;



