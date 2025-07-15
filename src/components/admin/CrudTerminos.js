import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllDemarcations,
  updateDemarcation,
  getAllSecurityPolicies,
  updateSecurityPolicy,
  getAllTerms,
  updateTerms,
} from '../../api/admin';

export default function CrudTerminos() {
  const [section, setSection] = useState('demarcations');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempInfo, setTempInfo] = useState('');

  const fetchData = async () => {
    try {
      let data = [];
      if (section === 'demarcations') data = await getAllDemarcations();
      if (section === 'securityPolicies') data = await getAllSecurityPolicies();
      if (section === 'terms') data = await getAllTerms();
      setItems(data);
    } catch {
      toast.error('Error al cargar datos');
    }
  };

  useEffect(() => {
    fetchData();
  }, [section]);

  const startEdit = (id, currentInfo) => {
    setEditingId(id);
    setTempInfo(currentInfo);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempInfo('');
  };

  const clearEditor = () => {
    // Limpia el campo para escribir uno nuevo
    setTempInfo('');
  };

  const saveEdit = async (id) => {
    const wordCount = tempInfo.trim().split(/\s+/).filter(w => w).length;
    if (wordCount < 10) {
      toast.error('Debe ingresar al menos 10 palabras.');
      return;
    }
    try {
      if (section === 'demarcations') await updateDemarcation(id, { info: tempInfo });
      if (section === 'securityPolicies') await updateSecurityPolicy(id, { info: tempInfo });
      if (section === 'terms') await updateTerms(id, { info: tempInfo });
      toast.success('Actualizado exitosamente');
      cancelEdit();
      fetchData();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="p-40">
      <h2 className="form-title text-center mb-4">Administrar documentos</h2>
      <div className="mb-4 max-w-2xl mx-auto">
        <select
          value={section}
          onChange={(e) => { setSection(e.target.value); cancelEdit(); }}
          className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#2C75B2] dark:focus:ring-yellow-500"
        >
          <option value="demarcations">Deslinde</option>
          <option value="securityPolicies">Políticas de Seguridad</option>
          <option value="terms">Términos y condiciones</option>
        </select>
      </div>

      <div className="mb-4 p-4 border border-gray-400 rounded-lg shadow-lg max-w-2xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="mb-4">
            {editingId === item.id ? (
              <>
                <textarea
                  rows={5}
                  className="form-input mb-2"
                  style={{ maxHeight: '200px', width: '100%' }}
                  value={tempInfo}
                  onChange={(e) => setTempInfo(e.target.value)}
                />
                <div className="flex justify-center gap-2">
                  <button onClick={() => saveEdit(item.id)} className="btn-aceptar">Guardar</button>
                  <button onClick={clearEditor} className="button-yellow">Limpiar por completo</button>
                  <button onClick={cancelEdit} className="btn-cancelar">Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-black dark:text-white whitespace-pre-wrap break-words mb-2">{item.info}</p>
                <button onClick={() => startEdit(item.id, item.info)} className="btn-aceptar">Editar</button>
              </>
            )}
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}
