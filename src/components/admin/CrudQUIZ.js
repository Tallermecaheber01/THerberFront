import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  createQuizQuestion,
  getAllQuizQuestions,
  updateQuizQuestion,
  deleteQuizQuestion,
  getQuizContact,
  updateQuizContact,
} from '../../api/admin'

function CrudQUIZ() {
  // — Estados preguntas —
  const [questions, setQuestions] = useState([])
  const [createForm, setCreateForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    correct_option: 'A',
  })
  const [editForm, setEditForm] = useState({
    id: null,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    correct_option: 'A',
  })
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toDeleteId, setToDeleteId] = useState(null)

  // — Estados contacto —
  const [contact, setContact] = useState({
    telefono: '',
    sitio_web: '',
    direccion: '',
    promocion: '',
  })
  const [contactEditing, setContactEditing] = useState(false)

  useEffect(() => {
    loadQuestions()
    loadContact()
  }, [])

  // — Carga inicial —
  const loadQuestions = async () => {
    const data = await getAllQuizQuestions()
    Array.isArray(data) && setQuestions(data)
  }
  const loadContact = async () => {
    const data = await getQuizContact()
    data && setContact(data)
  }

  // — Contacto handlers —
  const handleContactChange = e =>
    setContact({ ...contact, [e.target.name]: e.target.value })
  const handleContactSave = async () => {
    const updated = await updateQuizContact(contact)
    setContact(updated)
    setContactEditing(false)
    toast.success('Contacto actualizado')
  }

  // — Creación handlers —
  const handleCreateChange = e =>
    setCreateForm({ ...createForm, [e.target.name]: e.target.value })
  const handleCreateSubmit = async e => {
    e.preventDefault()
    const newQ = await createQuizQuestion(createForm)
    setQuestions(qs => [...qs, newQ])
    toast.success('Pregunta creada')
    setCreateForm({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      correct_option: 'A',
    })
  }

  // — Edición inline handlers —
  const startEdit = q => {
    setEditForm({ ...q })
    setEditingId(q.id)
  }
  const handleEditChange = e =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  const handleEditSubmit = async e => {
    e.preventDefault()
    await updateQuizQuestion(editForm)
    setQuestions(qs =>
      qs.map(q => (q.id === editingId ? { ...editForm } : q))
    )
    toast.success('Pregunta actualizada')
    setEditingId(null)
  }

  // — Borrar handlers —
  const confirmDelete = id => {
    setToDeleteId(id)
    setShowModal(true)
  }
  const handleDelete = async () => {
    await deleteQuizQuestion({ id: toDeleteId })
    setQuestions(qs => qs.filter(q => q.id !== toDeleteId))
    toast.success('Pregunta eliminada')
    setShowModal(false)
  }

  // — Filtrado búsqueda —
  const filtered = questions.filter(q =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 max-w-3xl mx-auto mt-28 space-y-8">
      {/* Título */}
      <h1 className="text-2xl font-bold text-black dark:text-yellow-300 text-center">
        Gestión de Quiz & Contacto
      </h1>

      {/* Contacto */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
        {!contactEditing ? (
          <>
            <p className="text-black dark:text-white">
              <strong>Teléfono:</strong> {contact.telefono}
            </p>
            <p className="text-black dark:text-white">
              <strong>Sitio:</strong> {contact.sitio_web}
            </p>
            <p className="text-black dark:text-white">
              <strong>Dirección:</strong> {contact.direccion}
            </p>
            <p className="text-green-700 dark:text-green-300">
              {contact.promocion}
            </p>
            <button
              onClick={() => setContactEditing(true)}
              className="btn-aceptar px-3 py-1"
            >
              Editar contacto
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <label className="block text-black dark:text-white">Teléfono</label>
            <input
              name="telefono"
              value={contact.telefono}
              onChange={handleContactChange}
              className="form-input w-full"
            />
            <label className="block text-black dark:text-white">Sitio web</label>
            <input
              name="sitio_web"
              value={contact.sitio_web}
              onChange={handleContactChange}
              className="form-input w-full"
            />
            <label className="block text-black dark:text-white">Dirección</label>
            <input
              name="direccion"
              value={contact.direccion}
              onChange={handleContactChange}
              className="form-input w-full"
            />
            <label className="block text-black dark:text-white">Promoción</label>
            <textarea
              name="promocion"
              value={contact.promocion}
              onChange={handleContactChange}
              className="form-input w-full h-24"
            />
            <div className="flex space-x-2">
              <button onClick={handleContactSave} className="btn-aceptar">
                Guardar
              </button>
              <button
                onClick={() => {
                  loadContact()
                  setContactEditing(false)
                }}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formulario Nueva Pregunta */}
      <form
        onSubmit={handleCreateSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-yellow-300">
          Nueva Pregunta
        </h2>
        <input
          name="question_text"
          value={createForm.question_text}
          onChange={handleCreateChange}
          placeholder="Enunciado"
          className="form-input mb-2 w-full"
          required
        />
        <div className="flex space-x-2 mb-2">
          <input
            name="option_a"
            value={createForm.option_a}
            onChange={handleCreateChange}
            placeholder="Opción A"
            className="form-input w-1/3"
            required
          />
          <input
            name="option_b"
            value={createForm.option_b}
            onChange={handleCreateChange}
            placeholder="Opción B"
            className="form-input w-1/3"
            required
          />
          <input
            name="option_c"
            value={createForm.option_c}
            onChange={handleCreateChange}
            placeholder="Opción C"
            className="form-input w-1/3"
            required
          />
        </div>
        <select
          name="correct_option"
          value={createForm.correct_option}
          onChange={handleCreateChange}
          className="form-input mb-4 w-1/3"
        >
          <option value="A">A Correcta</option>
          <option value="B">B Correcta</option>
          <option value="C">C Correcta</option>
        </select>
        <div className="flex justify-end">
          <button type="submit" className="btn-aceptar w-full py-2">
            Crear
          </button>
        </div>
      </form>

      {/* Buscador */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black dark:text-yellow-300">
          Preguntas del Quiz
        </h2>
        <input
          type="text"
          placeholder="Buscar pregunta..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="form-input w-1/3"
        />
      </div>

      {/* Lista y edición inline */}
      <div className="space-y-4">
        {filtered.map(q => (
          <div
            key={q.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            {editingId === q.id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-yellow-300">
                  Editar Pregunta
                </h2>
                <input
                  name="question_text"
                  value={editForm.question_text}
                  onChange={handleEditChange}
                  placeholder="Enunciado"
                  className="form-input mb-2 w-full"
                  required
                />
                <div className="flex space-x-2 mb-2">
                  <input
                    name="option_a"
                    value={editForm.option_a}
                    onChange={handleEditChange}
                    placeholder="Opción A"
                    className="form-input w-1/3"
                    required
                  />
                  <input
                    name="option_b"
                    value={editForm.option_b}
                    onChange={handleEditChange}
                    placeholder="Opción B"
                    className="form-input w-1/3"
                    required
                  />
                  <input
                    name="option_c"
                    value={editForm.option_c}
                    onChange={handleEditChange}
                    placeholder="Opción C"
                    className="form-input w-1/3"
                    required
                  />
                </div>
                <select
                  name="correct_option"
                  value={editForm.correct_option}
                  onChange={handleEditChange}
                  className="form-input mb-4 w-1/3"
                >
                  <option value="A">A Correcta</option>
                  <option value="B">B Correcta</option>
                  <option value="C">C Correcta</option>
                </select>
                <div className="flex justify-end">
                  <button type="submit" className="btn-aceptar w-full py-2">
                    Actualizar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="font-semibold text-black dark:text-white mb-1">
                  {q.question_text}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  A: {q.option_a} | B: {q.option_b} | C: {q.option_c}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => startEdit(q)}
                    className="btn-aceptar px-3 py-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmDelete(q.id)}
                    className="btn-cancelar px-3 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="mb-4 text-black dark:text-white">
              ¿Confirmas que deseas eliminar esta pregunta?
            </p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={handleDelete} className="btn-aceptar">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default CrudQUIZ