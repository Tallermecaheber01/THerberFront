import React, { useState } from 'react';

function CrudServicios() {
  // Almacena los servicios
  const [servicios, setServicios] = useState([]);
  const [datosServicio, setDatosServicio] = useState({
    nombre: '',
    descripcion: '',
    tipoVehiculo: '',
    marcas: '',
    imagen: null,
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagen') {
      if (files[0]) {
        const archivo = files[0];
        // el archivojpg
        if (!archivo.name.toLowerCase().endsWith('.jpg') || archivo.type !== 'image/jpeg') {
          alert('Solo se permiten imágenes en formato .jpg');
          e.target.value = '';
          setDatosServicio({ ...datosServicio, imagen: null });
          return;
        }
        setDatosServicio({ ...datosServicio, imagen: archivo });
      } else {
        setDatosServicio({ ...datosServicio, imagen: null });
      }
    } else {
      // Validación para el campo "nombre": no se permiten números
      if (name === 'nombre' && /\d/.test(value)) {
        alert(`El campo ${name} no puede contener números.`);
        return;
      }
      setDatosServicio({ ...datosServicio, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datosServicio.imagen) {
      alert("Debe agregar una imagen en formato .jpg.");
      return;
    }

    if (modoEdicion) {
      setServicios(
        servicios.map((servicio) =>
          servicio.id === idEdicion ? { ...datosServicio, id: idEdicion } : servicio
        )
      );
      setModoEdicion(false);
      setIdEdicion(null);
    } else {
      const nuevoServicio = { ...datosServicio, id: Date.now() };
      setServicios([...servicios, nuevoServicio]);
    }
    setDatosServicio({
      nombre: '',
      descripcion: '',
      tipoVehiculo: '',
      marcas: '',
      imagen: null,
    });
  };

  const editarServicio = (servicio) => {
    setModoEdicion(true);
    setIdEdicion(servicio.id);
    setDatosServicio({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      tipoVehiculo: servicio.tipoVehiculo,
      marcas: servicio.marcas,
      imagen: servicio.imagen,
    });
  };

  const eliminarServicio = (id) => {
    setServicios(servicios.filter((servicio) => servicio.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="form-title mb-4">Administrar Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleSubmit} className="form-card">
            <h2 className="form-title mb-4">
              {modoEdicion ? 'Editar Servicio' : 'Agregar Servicio'}
            </h2>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Servicio
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-input"
                value={datosServicio.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-input"
                value={datosServicio.descripcion}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="tipoVehiculo" className="form-label">
                Tipo de Vehículo
              </label>
              <select
                id="tipoVehiculo"
                name="tipoVehiculo"
                className="form-input"
                value={datosServicio.tipoVehiculo}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tipo</option>
                <option value="Automóvil">Automóvil</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="marcas" className="form-label">
                Marcas
              </label>
              <select
                id="marcas"
                name="marcas"
                className="form-input"
                value={datosServicio.marcas}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una marca</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Nissan">Nissan</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="imagen" className="form-label">
                Imagen
              </label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                className="form-input"
                onChange={handleChange}
                accept=".jpg"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-aceptar">
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Servicio'}
              </button>
              {modoEdicion && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEdicion(null);
                    setDatosServicio({
                      nombre: '',
                      descripcion: '',
                      tipoVehiculo: '',
                      marcas: '',
                      imagen: null,
                    });
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        {/* Se muestran los servicios */}
        <div>
          <h2 className="services-title mb-4">Servicios</h2>
          {servicios.length === 0 ? (
            <p className="no-resultados">No hay servicios disponibles.</p>
          ) : (
            <div className="space-y-4">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="service-card p-4">
                  <div className="flex items-center">
                    {servicio.imagen && (
                      <img
                        src={URL.createObjectURL(servicio.imagen)}
                        alt={servicio.nombre}
                        className="w-24 h-24 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <h3 className="service-card-title">{servicio.nombre}</h3>
                      <p className="service-card-text">{servicio.descripcion}</p>
                      <p className="service-card-text">
                        <span className="detalle-label">Tipo:</span> {servicio.tipoVehiculo}
                      </p>
                      <p className="service-card-text">
                        <span className="detalle-label">Marcas:</span> {servicio.marcas}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => editarServicio(servicio)}
                      className="button-yellow"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarServicio(servicio.id)}
                      className="btn-cancelar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrudServicios;


