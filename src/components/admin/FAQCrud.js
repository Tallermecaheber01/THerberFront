import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
} from '../../api/admin';

function FAQCrud() {
  const [faqs, setFaqs] = useState([]);
  const [createForm, setCreateForm] = useState({ pregunta: '', respuesta: '' });
  const [editForm, setEditForm] = useState({ pregunta: '', respuesta: '', id_faq: null });
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    const data = await getAllFaqs();
    if (Array.isArray(data)) setFaqs(data);
  };

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateFaq(editForm);
      setFaqs(faqs.map(f => (f.id_faq === editForm.id_faq ? { ...f, pregunta: editForm.pregunta, respuesta: editForm.respuesta } : f)));
      toast.success('FAQ actualizada');
      setEditForm({ pregunta: '', respuesta: '', id_faq: null });
      setEditing(false);
    } else {
      const newFaq = await createFaq({ pregunta: createForm.pregunta, respuesta: createForm.respuesta });
      setFaqs([...faqs, newFaq]);
      toast.success('FAQ creada');
      setCreateForm({ pregunta: '', respuesta: '' });
    }
  };

  const handleEdit = (faq) => {
    setEditForm(faq);
    setEditing(true);
  };

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    await deleteFaq(toDeleteId);
    setFaqs(faqs.filter(f => f.id_faq !== toDeleteId));
    toast.success('FAQ eliminada');
    setShowModal(false);
    setToDeleteId(null);
  };

  const filteredFaqs = faqs.filter(
    faq => faq.pregunta.toLowerCase().includes(searchQuery.toLowerCase()) || faq.respuesta.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-3xl mx-auto mt-28">
      <h1 className="text-2xl font-bold text-black dark:text-yellow-300 text-center mb-4">Gestión de Preguntas Frecuentes</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <input
          type="text"
          name="pregunta"
          value={createForm.pregunta}
          onChange={handleCreateChange}
          placeholder="Pregunta"
          className="form-input mb-2"
          required
        />
        <textarea
          name="respuesta"
          value={createForm.respuesta}
          onChange={handleCreateChange}
          placeholder="Respuesta"
          className="form-input mb-2 h-24"
          required
        />
        <div className="flex items-center space-x-2">
          <button type="submit" className="btn-aceptar">Crear</button>
          {editing && (
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => {
                setEditForm({ pregunta: '', respuesta: '', id_faq: null });
                setEditing(false);
              }}
            >Cancelar edición</button>
          )}
        </div>
      </form>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black dark:text-yellow-300">Preguntas frecuentes creadas</h2>
        <input
          type="text"
          placeholder="Buscar FAQ"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="form-input w-1/3"
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <div key={faq.id_faq} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            {editing && editForm.id_faq === faq.id_faq ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="pregunta"
                  value={editForm.pregunta}
                  onChange={handleEditChange}
                  className="form-input mb-2"
                  required
                />
                <textarea
                  name="respuesta"
                  value={editForm.respuesta}
                  onChange={handleEditChange}
                  className="form-input mb-2 h-24"
                  required
                />
                <div className="flex items-center space-x-2">
                  <button type="submit" className="btn-aceptar">Actualizar</button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => {
                      setEditForm({ pregunta: '', respuesta: '', id_faq: null });
                      setEditing(false);
                    }}
                  >Cancelar edición</button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="font-semibold text-black dark:text-white">{faq.pregunta}</h3>
                <p className="text-black dark:text-white">{faq.respuesta}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <button onClick={() => handleEdit(faq)} className="btn-aceptar px-3 py-1">Editar</button>
                  <button onClick={() => confirmDelete(faq.id_faq)} className="btn-cancelar px-3 py-1">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="mb-4 text-black dark:text-white">¿Confirmas que deseas eliminar esta FAQ?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="btn-cancelar">Cancelar</button>
              <button onClick={handleDelete} className="btn-aceptar">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default FAQCrud;
