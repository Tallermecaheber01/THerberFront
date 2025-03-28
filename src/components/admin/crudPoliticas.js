import React, { useState, useEffect } from 'react';
import { getAllPolices, createPolice, updatePolice, updatePoliceStatus } from '../../api/admin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PoliciesManager = () => {
  // Estado para crear nueva política
  const [createDescription, setCreateDescription] = useState('');
  // Estados para listado y edición de cada política
  const [policies, setPolicies] = useState([]);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [editingDescription, setEditingDescription] = useState('');

  // Refrescar cada 1 segundo
  useEffect(() => {
    fetchPolicies();
    const interval = setInterval(() => {
      fetchPolicies();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPolicies = async () => {
    try {
      const data = await getAllPolices();
      console.log('Datos recibidos:', data);
      if (Array.isArray(data)) {
        setPolicies(data);
      } else if (data?.policies) {
        setPolicies(data.policies);
      } else {
        console.error('Estructura de datos inesperada:', data);
        setPolicies([]);
      }
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      toast.error("Error al cargar las políticas");
    }
  };

  // Manejo del formulario de creación
  const handleCreate = async (e) => {
    e.preventDefault();
  
    const allPolicies = await getAllPolices();
    const newPolicy = {
      descripcion: createDescription,
      fecha: new Date().toISOString(),
      estado: allPolicies.length === 0 ? "Activo" : "Inactivo",
    };
  
    try {
      const response = await createPolice(newPolicy);
  
      if (response && response.id) {
        fetchPolicies();
        setCreateDescription('');
        toast.success("Política creada exitosamente");
      } else {
        toast.error("Error: " + (response.error || "No se pudo crear la política"));
      }
      
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error en la solicitud");
    }
  };

  // Iniciar modo edición para una política específica
  const handleEditClick = (policy) => {
    setEditingPolicyId(policy.id);
    setEditingDescription(policy.descripcion);
  };

  // Guardar edición en la política
  const handleEditSave = async (policy) => {
    const updatedPolicy = {
      descripcion: editingDescription,
      fecha: new Date().toISOString(),
      estado: policy.estado,
    };
  
    try {
      const response = await updatePolice(policy.id, updatedPolicy);
  
      // Verificar que la respuesta tenga datos válidos
      if (response && Object.keys(response).length > 0) {
        fetchPolicies();
        setEditingPolicyId(null);
        setEditingDescription('');
        toast.success("Política actualizada exitosamente");
      } else {
        toast.error("Error: Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error en la solicitud");
    }
  };
  

  // Cancelar edición
  const handleEditCancel = () => {
    setEditingPolicyId(null);
    setEditingDescription('');
  };

  // Activar una política (si no es la vigente) usando updatePoliceStatus
  const handleActivate = async (policy) => {
    if (policy.estado === "Activo") return;
    try {
      const res = await updatePoliceStatus(policy.id);
      console.log("Respuesta de updatePoliceStatus:", res);
      // Si res.data existe, usamos esa información
      const response = res.data ? res.data : res;
      
      if (response && response.success) {
        toast.success("Política activada exitosamente");
        fetchPolicies();
      } else {
        const errorMsg = response?.error?.message || "Error al activar la política";
      }
    } catch (error) {
    }
  };
  
  

  // Ordenamos las políticas para que la vigente aparezca primero
  const sortedPolicies = [...policies].sort((a, b) => {
    if (a.estado === "Activo") return -1;
    if (b.estado === "Activo") return 1;
    return 0;
  });

  return (
    <div className="p-10">
      {/* Card de Creación */}
      <div className="form-card w-full max-w-xl mx-auto mb-8 min-h-[200px] flex flex-col justify-between">
        <h3 className="form-title mb-4 text-center">Crear Política</h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Descripción:</label>
            <textarea
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              required
              className="form-input h-28 resize-none"
            ></textarea>
          </div>
          <button type="submit" className="button-yellow">
            Crear Política
          </button>
        </form>
      </div>

      {/* Listado de Políticas */}
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
        Listado de Políticas
      </h2>
      <div className="grid grid-cols-1 gap-6 justify-center">
        {sortedPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-cardClaro dark:bg-cardObscuro rounded-lg shadow-lg p-4 w-full max-w-xl mx-auto min-h-[200px] flex flex-col justify-between"
          >
            {editingPolicyId === policy.id ? (
              <>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="form-input w-full min-h-[120px] resize-y mb-2"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => handleEditSave(policy)} className="btn-aceptar">
                    Guardar
                  </button>
                  <button onClick={handleEditCancel} className="btn-cancelar">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 h-full justify-between">
                <span
                  className={`break-words ${policy.estado === "Activo" ? "text-xl font-bold text-green-600" : "text-base"} text-white dark:text-gray-300`}
                >
                  {policy.descripcion}
                </span>
                <div className="flex justify-end gap-2">
                  {policy.estado === "Activo" ? (
                    <span className="px-4 py-1 bg-green-600 text-white rounded">
                      Vigente
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivate(policy)}
                      className="btn-blue"  // Botón de color azul
                    >
                      Activar
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(policy)}
                    className="button-yellow w-auto px-4 py-1"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PoliciesManager;

