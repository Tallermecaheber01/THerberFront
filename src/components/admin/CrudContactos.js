import React, { useState } from 'react';
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


// Componente principal de Contactos
const Contactos = () => {
  const [contacts, setContacts] = useState([]);
  const [newSocialName, setNewSocialName] = useState('');
  const [newData, setNewData] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editSocialName, setEditSocialName] = useState('');
  const [editData, setEditData] = useState('');

  // Validaciones
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

  // Obtener el icono de la red social
  const socialIcons = {
    instagram: { component: FaInstagram, color: `#${siInstagram.hex}` },
    facebook: { component: FaFacebook, color: `#${siFacebook.hex}` },
    twitter: { component: FaTwitter, color: "#1DA1F2" }, // Color manual para Twitter (X)
    whatsapp: { component: FaWhatsapp, color: `#${siWhatsapp.hex}` },
    wpp: { component: FaWhatsapp, color: `#${siWhatsapp.hex}` },
    correo: { component: FaEnvelope, color: "#D44638" },
    telefono: { component: FaPhone, color: "#000000" },
    phone: { component: FaPhone, color: "#000000" },
  };
  
  
  
  // Obtener el icono de la red social
  const getSocialIcon = (name) => {
    const lowerName = name.toLowerCase().trim();
    const iconData = socialIcons[lowerName] || socialIcons.whatsapp; 
    if (iconData) {
      const IconComponent = iconData.component;
      return <IconComponent className="text-2xl" style={{ color: iconData.color }} />;
    }
    return <FaLink className="text-2xl" />;
  };

  // Agregar nuevo contacto
// Ejemplo al agregar un nuevo contacto
const handleAddContact = (e) => {
    e.preventDefault();
    if (!validateName(newSocialName) || !validateData(newData)) return;
    
    const formattedSocialName = newSocialName.trim().toLowerCase().includes("whatsapp")
      ? "whatsapp"  // Si contiene "whatsapp", usar solo "whatsapp" como nombre
      : newSocialName.trim();
  
    const newContact = {
      id: Date.now(),
      socialName: formattedSocialName,  // Aquí asignamos el nombre formateado
      data: newData.trim(),
    };
  
    setContacts([...contacts, newContact]);
    setNewSocialName('');
    setNewData('');
    toast.success("Contacto agregado.");
  };
  

  // Eliminar contacto
  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success("Contacto eliminado.");
  };

  // Editar contacto
  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditSocialName(contact.socialName);
    setEditData(contact.data);
  };

  // Guardar edición
  const handleSaveEdit = (id) => {
    if (!validateName(editSocialName) || !validateData(editData)) return;
    setContacts(contacts.map(contact =>
      contact.id === id 
        ? { ...contact, socialName: editSocialName.trim(), data: editData.trim() } 
        : contact
    ));
    setEditingId(null);
    toast.success("Contacto actualizado.");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="form-title text-center mb-4">Gestión de Contactos</h2>
      
      {/* Formulario para agregar nuevo contacto */}
      <form onSubmit={handleAddContact} className="mb-6 p-4 border border-gray-400 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">Agregar Nuevo Contacto</h3>
        <div className="mb-4">
          <label className="form-label">Nombre de la Red Social</label>
          <input
            type="text"
            value={newSocialName}
            onChange={(e) => setNewSocialName(e.target.value)}
            className="form-input"
            placeholder="Ej: Instagram, WhatsApp, etc."
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Dato (número, enlace, etc.)</label>
          <input
            type="text"
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            className="form-input"
            placeholder="Ej: @usuario, +123456789 o un link completo"
          />
        </div>
        <button type="submit" className="btn-aceptar">Agregar Contacto</button>
      </form>

      {/* Lista de contactos */}
      <div className="space-y-4">
        {contacts.map(contact => (
     <div key={contact.id} className="p-4 border border-gray-400 rounded-lg shadow-lg flex flex-col gap-4">
     <div className="flex items-center gap-4">
       {/* Icono social */}
       {getSocialIcon(contact.socialName)}
   
       {/* Información editable o normal */}
       {editingId === contact.id ? (
         <div className="flex flex-col gap-2">
           <input 
             type="text" 
             value={editSocialName} 
             onChange={(e) => setEditSocialName(e.target.value)}
             className="form-input mb-2"
             placeholder="Nombre de la red social"
           />
           <input 
             type="text" 
             value={editData} 
             onChange={(e) => setEditData(e.target.value)}
             className="form-input"
             placeholder="Dato del contacto"
           />
         </div>
       ) : (
         <div className="flex flex-col">
           <p className="detalle-title">{contact.socialName}</p>
           {/* Añadimos 'break-words' para evitar el desbordamiento en enlaces largos */}
           <p className="detalle-descripcion">{contact.data}</p>
         </div>
       )}
     </div>
   
     {/* Botones debajo */}
     <div className="flex gap-2 mt-4">
       {editingId === contact.id ? (
         <>
           <button onClick={() => handleSaveEdit(contact.id)} className="btn-aceptar px-4 py-2">Guardar</button>
           <button onClick={handleCancelEdit} className="btn-cancelar px-4 py-2">Cancelar</button>
         </>
       ) : (
         <>
           <button onClick={() => handleEdit(contact)} className="btn-aceptar px-4 py-2">Editar</button>
           <button onClick={() => handleDelete(contact.id)} className="btn-cancelar px-4 py-2">Eliminar</button>
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
