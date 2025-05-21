import React, { useState, useEffect } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCorporateImage, getCorporateImageById } from '../../api/admin';

function InformacionEmpresa() {
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [values, setValues] = useState("");
  const [objective, setObjective] = useState("");
  const [specificObjectives, setSpecificObjectives] = useState("");
  const [activeEditor, setActiveEditor] = useState(null);
  const [tempContent, setTempContent] = useState("");
  const [selectedSection, setSelectedSection] = useState("mission"); // Por defecto: Misión

  useEffect(() => {
    const fetchData = async () => {
      try {
        const missionData = await getCorporateImageById(1);
        const visionData = await getCorporateImageById(2);
        const valuesData = await getCorporateImageById(3);
        const objectiveData = await getCorporateImageById(4);
        const specificObjectivesData = await getCorporateImageById(5);
        setMission(missionData.descripcion);
        setVision(visionData.descripcion);
        setValues(valuesData.descripcion);
        setObjective(objectiveData.descripcion);
        setSpecificObjectives(specificObjectivesData.descripcion);
      } catch (error) {
        toast.error("Error al cargar la información");
      }
    };
    fetchData();
  }, []);

  
  const validateContent = (content) => {
    if (content.trim().length < 30) {
      toast.error("El contenido debe tener al menos 30 caracteres.");
      return false;
    }
    const allowedPattern = /^[a-zA-Z0-9À-ÿ\s.,:;!?¿¡'"()%\$\-]+$/;
    if (!allowedPattern.test(content)) {
      toast.error("El contenido contiene caracteres especiales no permitidos.");
      return false;
    }
    return true;
  };

  const handleEdit = (field) => {
    if (activeEditor !== null) return;
    setActiveEditor(field);
    if (field === 'mission') setTempContent(mission);
    else if (field === 'vision') setTempContent(vision);
    else if (field === 'values') setTempContent(values);
    else if (field === 'objective') setTempContent(objective);
    else if (field === 'specificObjectives') setTempContent(specificObjectives);
  };

  const handleSave = async () => {
    if (!validateContent(tempContent)) return;
    let id;
    if (activeEditor === 'mission') id = 1;
    else if (activeEditor === 'vision') id = 2;
    else if (activeEditor === 'values') id = 3;
    else if (activeEditor === 'objective') id = 4;
    else if (activeEditor === 'specificObjectives') id = 5;
    
    try {
      await updateCorporateImage(id, { descripcion: tempContent });
      toast.success("Actualización exitosa");
      if (activeEditor === 'mission') setMission(tempContent);
      else if (activeEditor === 'vision') setVision(tempContent);
      else if (activeEditor === 'values') setValues(tempContent);
      else if (activeEditor === 'objective') setObjective(tempContent);
      else if (activeEditor === 'specificObjectives') setSpecificObjectives(tempContent);
    } catch (error) {
      toast.error("Error al actualizar");
    } finally {
      setActiveEditor(null);
      setTempContent("");
    }
  };

  const handleClear = () => {
    setTempContent("");
  };

  const handleCancel = () => {
    setActiveEditor(null);
    setTempContent("");
  };

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
        <div style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
          <p className="white-text whitespace-pre-wrap break-words">{content}</p>
        </div>
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

  const sections = {
    mission: { label: "Misión", content: mission, field: "mission" },
    vision: { label: "Visión", content: vision, field: "vision" },
    values: { label: "Valores", content: values, field: "values" },
    objective: { label: "Objetivo", content: objective, field: "objective" },
    specificObjectives: { label: "Objetivos Específicos", content: specificObjectives, field: "specificObjectives" },
  };

  const currentSection = sections[selectedSection];

  return (
    <div className="p-40">
      <h2 className="form-title text-center mb-4">Informacion empresa</h2>
      
      <div className="mb-4 max-w-2xl mx-auto">
        <select 
          value={selectedSection}
          onChange={(e) => {
            setActiveEditor(null); 
            setSelectedSection(e.target.value);
          }}
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#2C75B2] dark:focus:ring-yellow-500;"
        >
          <option value="mission">Misión</option>
          <option value="vision">Visión</option>
          <option value="values">Valores</option>
          <option value="objective">Objetivo</option>
          <option value="specificObjectives">Objetivos Específicos</option>
        </select>
      </div>
      
      <div className="mb-4 p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h3 className="form-title text-[#1f618d]">
        {currentSection.label}
      </h3> 
      <div className="!text-black [&_*]:text-black">
    {renderEditor(currentSection.field, currentSection.label, currentSection.content)}
  </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default InformacionEmpresa;

