import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaLink
} from 'react-icons/fa';
import { siInstagram, siFacebook, siTwitter, siWhatsapp, siLinkedin } from 'simple-icons';
import 'react-toastify/dist/ReactToastify.css';
import { deleteContact, getAllContacts, updateContact, createContact } from '../../api/admin';

const Contactos = () => {
  const [contacts, setContacts] = useState([]);
  const [newSocialName, setNewSocialName] = useState('');
  const [newData, setNewData] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editSocialName, setEditSocialName] = useState('');
  const [editData, setEditData] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getAllContacts();
      console.log("Respuesta de getAllContacts:", response);
      setContacts(response || []);
    } catch (error) {
      toast.error("Error al cargar los contactos.");
      setContacts([]);
    }
  };

  const allowedNamePattern = /^[a-zA-Z0-9À-ÿ\s]+$/;
  const validateName = (name) => {
    if (name.trim().length < 1) {
      toast.error("El nombre de la red social no puede estar vacío.");
      return false;
    }
    if (!allowedNamePattern.test(name.trim())) {
      toast.error("El nombre contiene caracteres especiales no permitidos.");
      return false;
    }
    return true;
  };

  const allowedDataPattern = /^[a-zA-Z0-9À-ÿ\s\.,:;!?¿¡'"()%$@\/\?=#&_ -]+$/;
  const validateData = (data) => {
    if (data.trim().length < 1) {
      toast.error("El dato del contacto no puede estar vacío.");
      return false;
    }
    if (!allowedDataPattern.test(data.trim())) {
      toast.error("El dato contiene caracteres especiales no permitidos.");
      return false;
    }
    return true;
  };

  const socialIcons = {
    instagram: { component: FaInstagram, color: `#${siInstagram.hex}` },
    facebook: { component: FaFacebook, color: `#${siFacebook.hex}` },
    twitter: { component: FaTwitter, color: "#1DA1F2" },
    whatsapp: { component: FaWhatsapp, color: `#${siWhatsapp.hex}` },
    wpp: { component: FaWhatsapp, color: `#${siWhatsapp.hex}` },
    correo: { component: FaEnvelope, color: "#D44638" },
    telefono: { component: FaPhone, color: "#00a33d" },
    phone: { component: FaPhone, color: "#00a33d" },
  };

  const getSocialIcon = (name) => {
    const lowerName = name.toLowerCase().trim();
    const iconData = socialIcons[lowerName] || socialIcons.whatsapp;
    if (iconData) {
      const IconComponent = iconData.component;
      return <IconComponent className="text-xl" style={{ color: iconData.color }} />;
    }
    return <FaLink className="text-xl" />;
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!validateName(newSocialName) || !validateData(newData)) return;
    
    const formattedSocialName = newSocialName.trim().toLowerCase().includes("whatsapp")
      ? "whatsapp"
      : newSocialName.trim();
    
    const payload = {
      nombre: formattedSocialName,
      informacion: newData.trim(),
    };
    
    try {
      await createContact(payload);
      toast.success("Contacto agregado.");
      setNewSocialName('');
      setNewData('');
      fetchContacts();
    } catch (error) {
      toast.error("Error al agregar el contacto.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      toast.success("Contacto eliminado.");
      fetchContacts();
    } catch (error) {
      toast.error("Error al eliminar el contacto.");
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditSocialName(contact.nombre);
    setEditData(contact.informacion);
  };

  const handleSaveEdit = async (id) => {
    if (!validateName(editSocialName) || !validateData(editData)) return;
    const payload = {
      nombre: editSocialName.trim(),
      informacion: editData.trim(),
    };
    try {
      await updateContact(id, payload);
      toast.success("Contacto actualizado.");
      setEditingId(null);
      fetchContacts();
    } catch (error) {
      toast.error("Error al actualizar el contacto.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-40">
      <h2 className="form-title text-center mb-4">Gestión de Contactos</h2>
      <form onSubmit={handleAddContact} className="mb-6 p-4 border border-gray-400 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-[#1c2833] dark:text-white mb-2">Agregar Nuevo Contacto</h3>
        <div className="mb-4">
          <label className="form-label">Nombre del contacto</label>
          <input
            type="text"
            value={newSocialName}
            onChange={(e) => setNewSocialName(e.target.value)}
            className="form-input"
            placeholder="Como Instagram, WhatsApp, etc."
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Dato (número, enlace, usuario)</label>
          <input
            type="text"
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            className="form-input"
            placeholder="Agrega un numero, usuario, o enlace de pagina o perfil"
          />
        </div>
        <button type="submit" className="btn-aceptar">Agregar Contacto</button>
      </form>

      {/* Lista de contactos  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {contacts.map(contact => (
          <div
            key={contact.id}
            className="border border-gray-300 rounded shadow p-3 h-48 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getSocialIcon(contact.nombre)}
                {editingId === contact.id ? (
                  <input
                    type="text"
                    value={editSocialName}
                    onChange={(e) => setEditSocialName(e.target.value)}
                    className="form-input text-base"
                    placeholder="Nombre"
                  />
                ) : (
                  <span className="text-[#1c2833] dark:text-yellow-400 text-base font-bold">{contact.nombre}</span>
                )}
              </div>
              <div className="mb-2">
                {editingId === contact.id ? (
                  <textarea
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    className="form-input text-base max-h-20 overflow-y-auto scrollbar-hide break-all"
                    placeholder="Información"
                  />
                ) : (
                  <div className="text-[#2C75B2] font-bold text-base max-h-20 overflow-y-auto scrollbar-hide break-all">
                    {contact.informacion}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {editingId === contact.id ? (
                <>
                  <button onClick={() => handleSaveEdit(contact.id)} className="btn-aceptar text-base">Guardar</button>
                  <button onClick={handleCancelEdit} className="btn-cancelar text-base">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(contact)} className="btn-aceptar text-base">Editar</button>
                  <button onClick={() => handleDelete(contact.id)} className="btn-cancelar text-base">Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Contactos;



