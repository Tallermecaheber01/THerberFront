import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  getUserInfo,
  getRole,
  updateUserInfo,
  updatePersonnelInfo,
  login as apiLogin,
  getAllQuestions
} from '../../api/public';
import { useNavigate } from 'react-router-dom';
import { generateSmartwatchCode } from '../../api/client';
import { toast, ToastContainer } from 'react-toastify';
import {
  FiEdit,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

function Bienvenida() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentVerified, setCurrentVerified] = useState(false);
  const [form, setForm] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', correo: '', telefono: '',
    currentPassword: '', newPassword: '', confirmPassword: '', idPreguntaSecreta: '', respuestaSecreta: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false, upperCase: false, lowerCase: false, number: false, specialChar: false, noSequence: false
  });
  const [codigoSmartwatch, setCodigoSmartwatch] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [lastGenTime, setLastGenTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preguntas, setPreguntas] = useState([]);

  const navigate = useNavigate();
  const TOKEN_DURATION = 10 * 60 * 1000;

  useEffect(() => {
    const token = document.cookie.split('; ').find(c => c.startsWith('authToken='))?.split('=')[1];
    if (!token) return navigate('/login');
    try {
      const tok = jwtDecode(decodeURIComponent(token));
      const { email } = tok;
      Promise.all([getUserInfo(email), getRole(email), getAllQuestions()])
        .then(([data, rolObj, preguntasData]) => {
          setUsuario(data);
          setRole(typeof rolObj === 'object' && rolObj.rol ? rolObj.rol : rolObj);
          setPreguntas(preguntasData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [navigate]);

  const getPasswordChecks = pwd => ({
    minLength: pwd.length >= 8 && pwd.length <= 20,
    upperCase: /[A-Z]/.test(pwd),
    lowerCase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    specialChar: /[!@#$%^&*]/.test(pwd),
    noSequence: !/(12345|abcd)/.test(pwd)
  });

  const validatePassword = pwd => Object.values(getPasswordChecks(pwd)).every(Boolean);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') {
      if (!showRequirements && value) setShowRequirements(true);
      setPasswordChecks(getPasswordChecks(value));
    }
  };

  const startEditing = () => {
    setForm({
      ...usuario,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      idPreguntaSecreta: '',
      respuestaSecreta: ''
    });
    setEditing(true);
    setCurrentVerified(false);
    setShowRequirements(false);
    setPasswordChecks({ minLength: false, upperCase: false, lowerCase: false, number: false, specialChar: false, noSequence: false });
  };

  const cancelEditing = () => {
    setEditing(false);
    setCurrentVerified(false);
    setForm({
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo: '',
      telefono: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      idPreguntaSecreta: '',
      respuestaSecreta: ''
    });
    setShowRequirements(false);
    setPasswordChecks({ minLength: false, upperCase: false, lowerCase: false, number: false, specialChar: false, noSequence: false });
  };

  const handleVerifyCurrent = async () => {
    if (!form.currentPassword) return toast.error('Ingresa tu contraseña actual');
    try {
      const ok = await apiLogin({ correo: usuario.correo, contrasena: form.currentPassword });
      if (ok) {
        setCurrentVerified(true);
        setForm(prev => ({ ...prev, currentPassword: '' }));
        toast.success('Contraseña verificada');
      } else toast.error('Contraseña incorrecta');
    } catch {
      toast.error('Error al verificar contraseña');
    }
  };

  const canGenerate = !lastGenTime || Date.now() - lastGenTime > TOKEN_DURATION;
  const handleVincularSmartwatch = async () => {
    if (!usuario?.id || !canGenerate) return;
    setGenerando(true);
    try {
      const code = await generateSmartwatchCode(usuario.id);
      setCodigoSmartwatch(code);
      setLastGenTime(Date.now());
    } catch {
      toast.error('Error al generar el código para el smartwatch');
    } finally {
      setGenerando(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setShowModal(false);
    const payload = {
      nombre: form.nombre,
      apellido_paterno: form.apellido_paterno,
      apellido_materno: form.apellido_materno,
      correo: form.correo,
      telefono: form.telefono
    };

    if (form.newPassword) {
      if (!currentVerified) return toast.error('Verifica tu contraseña actual primero');
      if (!form.confirmPassword) return toast.error('Debe confirmar la nueva contraseña');
      if (form.newPassword !== form.confirmPassword) return toast.error('Las nuevas contraseñas no coinciden');
      if (!validatePassword(form.newPassword)) return toast.error('La contraseña no cumple los requisitos');
      payload.contrasena = form.newPassword;
    }

    if (form.idPreguntaSecreta) {
      if (!currentVerified) return toast.error('Verifica tu contraseña actual primero');
      if (!form.respuestaSecreta) return toast.error('Debe proporcionar la respuesta secreta');
      payload.idPreguntaSecreta = parseInt(form.idPreguntaSecreta);
      payload.respuestaSecreta = form.respuestaSecreta;
    }

    try {
      const updated = role === 'cliente'
        ? await updateUserInfo(usuario.id, payload)
        : await updatePersonnelInfo(usuario.id, payload);
      setUsuario(updated);
      setEditing(false);
      cancelEditing();
    } catch {
      toast.error('Error al actualizar perfil');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="form-card relative w-full max-w-md">
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="form-card w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg relative">
              <h2 className="text-xl font-bold mb-4 text-green-600 text-center dark:text-green-400">Confirmar actualización</h2>
              <p className="mb-6 text-sm dark:text-gray-300">
                ¿Estás seguro de que deseas actualizar tu información?
                <br />
                <strong className="text-red-600 dark:text-red-500 text-center">
                  Si cambias tus datos de contacto y pierdes acceso a ellos, podrías perder el acceso a tu cuenta.
                </strong>
              </p>
              <div className="flex justify-end gap-4">
                <button onClick={confirmSubmit} className="btn-aceptar px-4 py-2">Sí, actualizar</button>
                <button onClick={() => { setShowModal(false); cancelEditing(); }} className="btn-cancelar px-4 py-2">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {!editing ? (
          <>
            <h1 className="detalle-title mt-4">¡Bienvenido, {usuario.nombre}!</h1>
            <div className="mt-4 space-y-2 text-lg dark:text-white">
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Apellido Paterno:</strong> {usuario.apellido_paterno}</p>
              <p><strong>Apellido Materno:</strong> {usuario.apellido_materno}</p>
              <p><strong>Email:</strong> {usuario.correo}</p>
              <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            </div>
            <button
              className="btn-aceptar absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-full"
              onClick={startEditing}
              title="Editar perfil"
            >
              <FiEdit size={20} />
            </button>
            {role === 'cliente' && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <p className="font-medium text-xl text-center text-green-700 dark:text-green-200">Vincular smartwatch:</p>
                <button onClick={handleVincularSmartwatch} className="btn-blue" disabled={generando || !canGenerate}>
                  {generando ? 'Generando...' : canGenerate ? 'Generar código' : 'Espera 10 min'}
                </button>
                {codigoSmartwatch && <div className="mt-2 font-bold text-lg">Código: {codigoSmartwatch}</div>}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="detalle-title">Editar perfil</h2>
            {["nombre", "apellido_paterno", "apellido_materno", "correo", "telefono"].map(f => (
              <div key={f} className="form-group">
                <label className="form-label capitalize">{f.replace('_', ' ')}</label>
                <input
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  required
                  className="form-input"
                  type={f === 'correo' ? 'email' : 'text'}
                />
              </div>
            ))}

            <div className="mt-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2">Configuración de seguridad</h3>
              {!currentVerified ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Para cambiar tu contraseña o pregunta secreta, verifica tu contraseña actual:</p>
                  <div className="form-group relative">
                    <label className="form-label">Contraseña actual</label>
                    <input
                      name="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <button type="button" className="absolute right-3 top-9" onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <button type="button" className="btn-aceptar w-full mt-2" onClick={handleVerifyCurrent}>
                    Verificar contraseña
                  </button>
                </>
              ) : (
                <>
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Cambiar Contraseña</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Si no desea cambiar la contraseña, deje los campos en blanco.</p>
                    <div className="form-group relative">
                      <label className="form-label">Nueva contraseña</label>
                      <input
                        name="newPassword"
                        type={showNew ? 'text' : 'password'}
                        value={form.newPassword}
                        onChange={handleChange}
                        className="form-input"
                      />
                      <button type="button" className="absolute right-3 top-9" onClick={() => setShowNew(!showNew)}>
                        {showNew ? <FiEyeOff /> : <FiEye />}
                      </button>
                      {showRequirements && (
                        <ul className="mt-2 space-y-1 text-sm">
                          {Object.entries(passwordChecks).map(([key, ok]) => (
                            <li key={key} className="flex items-center gap-2">
                              {ok ? <FiCheckCircle className="iconoCorrect" /> : <FiXCircle className="iconoError" />}
                              <span className="dark:text-gray-300">
                                {{
                                  minLength: 'Mínimo 8 caracteres (máx. 20)',
                                  upperCase: 'Al menos una mayúscula',
                                  lowerCase: 'Al menos una minúscula',
                                  number: 'Al menos un número',
                                  specialChar: 'Al menos un carácter especial (!@#$%^&*)',
                                  noSequence: 'Sin secuencias obvias como "12345" o "abcd"'
                                }[key]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="form-group relative">
                      <label className="form-label">Confirmar contraseña</label>
                      <input
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="form-input"
                      />
                      <button type="button" className="absolute right-3 top-9" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Cambiar Pregunta y Respuesta Secreta</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Si no desea cambiar la pregunta y respuesta secreta, deje estos campos sin seleccionar/llenar.</p>
                    <div className="form-group">
                      <label className="form-label">Nueva pregunta secreta</label>
                      <select
                        name="idPreguntaSecreta"
                        value={form.idPreguntaSecreta}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Selecciona una pregunta</option>
                        {preguntas.map(p => (
                          <option key={p.id} value={p.id}>{p.pregunta}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nueva respuesta secreta</label>
                      <input
                        name="respuestaSecreta"
                        type="text"
                        value={form.respuestaSecreta}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn-aceptar flex-1">Guardar</button>
              <button type="button" className="btn-cancelar flex-1" onClick={cancelEditing}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Bienvenida;