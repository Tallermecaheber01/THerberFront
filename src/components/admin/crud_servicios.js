import React, { useState, useRef } from 'react';

function CrudServicios() {
  // Estado para almacenar la lista de servicios creados.
  const [servicios, setServicios] = useState([]);

  // Estado para almacenar los datos del formulario de servicio.
  // Incluye nombre, descripción, arrays para tipos de vehículo y marcas seleccionadas, y la imagen.
  const [datosServicio, setDatosServicio] = useState({
    nombre: '',
    descripcion: '',
    tipoVehiculo: [], // Aquí se guardarán los tipos de vehículo agregados
    marcas: [],       // Aquí se guardarán las marcas agregadas
    imagen: null,
  });

  // Estados para almacenar la opción actualmente seleccionada en cada <select>
  // Estos estados permiten elegir una opción a la vez antes de agregarla al array.
  const [selectedTipoVehiculo, setSelectedTipoVehiculo] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');

  // Estado para determinar si estamos en modo edición (actualizando un servicio existente)
  const [modoEdicion, setModoEdicion] = useState(false);
  // Guarda el ID del servicio que se está editando
  const [idEdicion, setIdEdicion] = useState(null);

  // Referencia al input de archivo para poder reiniciarlo después de subir una imagen
  const fileInputRef = useRef(null);

  // Opciones disponibles para marcas y tipos de vehículo.
  // Estos valores se muestran en los selects y pueden modificarse dinámicamente.
  const [marcasOptions, setMarcasOptions] = useState([
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'Nissan',
    'Otro',
  ]);
  const [tipoVehiculoOptions, setTipoVehiculoOptions] = useState([
    'Automóvil',
    'Camioneta',
    'Motocicleta',
    'Otro',
  ]);

  // Estados para controlar la visibilidad de formularios emergentes para agregar nuevas opciones
  // (por si se requiere agregar una marca o tipo que no esté en la lista)
  const [showMarcaForm, setShowMarcaForm] = useState(false);
  const [newMarca, setNewMarca] = useState('');

  const [showTipoForm, setShowTipoForm] = useState(false);
  const [newTipo, setNewTipo] = useState('');

  // Función para manejar cambios en los inputs de texto y el input file (imagen)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el input es de tipo "file" (imagen)
    if (name === 'imagen') {
      if (files[0]) {
        const archivo = files[0];
        // Validación: se permite solo imágenes con extensión .jpg y tipo image/jpeg
        if (
          !archivo.name.toLowerCase().endsWith('.jpg') ||
          archivo.type !== 'image/jpeg'
        ) {
          alert('Solo se permiten imágenes en formato .jpg');
          e.target.value = ''; // Se limpia el valor del input
          setDatosServicio({ ...datosServicio, imagen: null });
          return;
        }
        // Se guarda el archivo en el estado
        setDatosServicio({ ...datosServicio, imagen: archivo });
      } else {
        setDatosServicio({ ...datosServicio, imagen: null });
      }
    } else {
      // Validación: el campo "nombre" no debe contener números
      if (name === 'nombre' && /\d/.test(value)) {
        alert(`El campo ${name} no puede contener números.`);
        return;
      }
      // Se actualiza el estado con el nuevo valor para el input
      setDatosServicio({ ...datosServicio, [name]: value });
    }
  };

  // Función para agregar un tipo de vehículo a la lista de tipos seleccionados.
  // Se usa el valor actualmente seleccionado en el select.
  const agregarTipoVehiculo = () => {
    if (
      selectedTipoVehiculo && 
      !datosServicio.tipoVehiculo.includes(selectedTipoVehiculo)
    ) {
      setDatosServicio((prev) => ({
        ...prev,
        tipoVehiculo: [...prev.tipoVehiculo, selectedTipoVehiculo],
      }));
    }
    // Se reinicia el valor del select
    setSelectedTipoVehiculo('');
  };

  // Función para eliminar un tipo de vehículo ya agregado.
  const eliminarTipoVehiculo = (tipo) => {
    setDatosServicio((prev) => ({
      ...prev,
      tipoVehiculo: prev.tipoVehiculo.filter((item) => item !== tipo),
    }));
  };

  // Función para agregar una marca a la lista de marcas seleccionadas.
  const agregarMarca = () => {
    if (selectedMarca && !datosServicio.marcas.includes(selectedMarca)) {
      setDatosServicio((prev) => ({
        ...prev,
        marcas: [...prev.marcas, selectedMarca],
      }));
    }
    // Se reinicia el select de marcas
    setSelectedMarca('');
  };

  // Función para eliminar una marca ya agregada.
  const eliminarMarca = (marca) => {
    setDatosServicio((prev) => ({
      ...prev,
      marcas: prev.marcas.filter((item) => item !== marca),
    }));
  };

  // Función para manejar el submit del formulario.
  // Se encarga de subir la imagen a Cloudinary (si es necesario) y almacenar el servicio.
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imagenUrl = datosServicio.imagen;

    // Si la imagen es un objeto File, se procede a subirla a Cloudinary
    if (datosServicio.imagen && datosServicio.imagen instanceof File) {
      const formData = new FormData();
      formData.append('file', datosServicio.imagen);
      formData.append('upload_preset', 'taller_heber_servicios'); // Reemplaza con tu upload_preset

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dtcjmtiwy/image/upload', // Reemplaza con tu cloud name
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        // Se obtiene la URL segura de la imagen subida
        imagenUrl = data.secure_url;
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }

    // Si no hay imagen, se muestra una alerta y se detiene el proceso
    if (!imagenUrl) {
      alert('Debe agregar una imagen en formato .jpg.');
      return;
    }

    // Se crea el objeto "servicio" con todos los datos del formulario.
    // Si es edición, se conserva el ID; de lo contrario se genera uno nuevo.
    const nuevoServicio = {
      ...datosServicio,
      imagen: imagenUrl,
      id: modoEdicion ? idEdicion : Date.now(),
    };

    // Si estamos en modo edición, se actualiza el servicio existente.
    // Caso contrario, se agrega el nuevo servicio a la lista.
    if (modoEdicion) {
      setServicios(
        servicios.map((s) => (s.id === idEdicion ? nuevoServicio : s))
      );
      setModoEdicion(false);
      setIdEdicion(null);
    } else {
      setServicios([...servicios, nuevoServicio]);
    }

    // Se imprime en consola el ID y la URL de la imagen (útil para debugging)
    console.log('Datos de la imagen');
    console.log('ID:', nuevoServicio.id);
    console.log('URL Imagen:', imagenUrl);

    // Se limpia el formulario y se reinician los estados auxiliares
    setDatosServicio({
      nombre: '',
      descripcion: '',
      tipoVehiculo: [],
      marcas: [],
      imagen: null,
    });
    setSelectedTipoVehiculo('');
    setSelectedMarca('');
    // Se reinicia el input file (para poder volver a subir otra imagen)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función para iniciar la edición de un servicio.
  // Se carga la información del servicio en el formulario y se activa el modo edición.
  const editarServicio = (servicio) => {
    setModoEdicion(true);
    setIdEdicion(servicio.id);
    setDatosServicio({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      tipoVehiculo: servicio.tipoVehiculo,
      marcas: servicio.marcas,
      imagen: servicio.imagen, // En este caso, la imagen ya es una URL
    });
  };

  // Función para eliminar un servicio de la lista.
  const eliminarServicio = (id) => {
    setServicios(servicios.filter((s) => s.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Título principal de la sección */}
      <h1 className="form-title mb-4">Administrar Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sección del formulario para agregar/editar servicios */}
        <div>
          <form onSubmit={handleSubmit} className="form-card">
            {/* Título del formulario, que cambia según el modo (agregar o editar) */}
            <h2 className="form-title mb-4">
              {modoEdicion ? 'Editar Servicio' : 'Agregar Servicio'}
            </h2>
            {/* Input para el nombre del servicio */}
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
            {/* Input para la descripción del servicio */}
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
            {/* Sección para seleccionar el Tipo de Vehículo */}
            <div className="form-group">
              <label className="form-label">Tipo de Vehículo</label>
              <div className="flex items-center">
                {/* Select de selección única para elegir un tipo */}
                <select
                  value={selectedTipoVehiculo}
                  onChange={(e) => setSelectedTipoVehiculo(e.target.value)}
                  className="form-input"
                >
                  <option value="">Seleccione un tipo</option>
                  {tipoVehiculoOptions.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {/* Botón para agregar el tipo seleccionado al array */}
                <button
                  type="button"
                  onClick={agregarTipoVehiculo}
                  className="btn-aceptar ml-2"
                >
                  Agregar
                </button>
              </div>
              {/* Muestra los tipos de vehículo agregados como "badges" con opción a eliminarlos */}
              <div className="mt-2">
                {datosServicio.tipoVehiculo.map((tipo, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded px-2 py-1 mr-2"
                  >
                    {tipo}{' '}
                    <button
                      type="button"
                      onClick={() => eliminarTipoVehiculo(tipo)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Sección para seleccionar las Marcas */}
            <div className="form-group">
              <label className="form-label">Marcas</label>
              <div className="flex items-center">
                {/* Select de selección única para elegir una marca */}
                <select
                  value={selectedMarca}
                  onChange={(e) => setSelectedMarca(e.target.value)}
                  className="form-input"
                >
                  <option value="">Seleccione una marca</option>
                  {marcasOptions.map((marca, index) => (
                    <option key={index} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
                {/* Botón para agregar la marca seleccionada */}
                <button
                  type="button"
                  onClick={agregarMarca}
                  className="btn-aceptar ml-2"
                >
                  Agregar
                </button>
              </div>
              {/* Muestra las marcas agregadas con opción de eliminarlas */}
              <div className="mt-2">
                {datosServicio.marcas.map((marca, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded px-2 py-1 mr-2"
                  >
                    {marca}{' '}
                    <button
                      type="button"
                      onClick={() => eliminarMarca(marca)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Input para seleccionar la imagen del servicio */}
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
                ref={fileInputRef}
              />
            </div>
            {/* Botones para enviar el formulario o cancelar la edición */}
            <div className="flex gap-2">
              <button type="submit" className="btn-aceptar">
                {modoEdicion ? 'Guardar Cambios' : 'Agregar Servicio'}
              </button>
              {modoEdicion && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    // Reinicia el modo edición y limpia el formulario
                    setModoEdicion(false);
                    setIdEdicion(null);
                    setDatosServicio({
                      nombre: '',
                      descripcion: '',
                      tipoVehiculo: [],
                      marcas: [],
                      imagen: null,
                    });
                    setSelectedTipoVehiculo('');
                    setSelectedMarca('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {/* Sección para mostrar formularios emergentes para agregar nuevas opciones a los selects */}
          {(!showTipoForm && !showMarcaForm) ? (
            <div className="flex gap-2 mt-2">
              {/* Botón para mostrar formulario de agregar un nuevo Tipo de Vehículo */}
              <button
                type="button"
                className="btn-aceptar w-auto text-sm py-2 px-1"
                onClick={() => setShowTipoForm(true)}
              >
                Agregar Tipo de Vehículo
              </button>
              {/* Botón para mostrar formulario de agregar una nueva Marca */}
              <button
                type="button"
                className="btn-aceptar w-auto text-sm py-2 px-1"
                onClick={() => setShowMarcaForm(true)}
              >
                Agregar Una nueva Marca
              </button>
            </div>
          ) : (
            <div className="mt-4">
              {/* Formulario emergente para agregar un nuevo Tipo de Vehículo */}
              {showTipoForm && (
                <div className="mt-2 p-2 border rounded w-96">
                  <div className="form-group">
                    <label htmlFor="newTipo" className="form-label mt-4">
                      Nuevo Tipo de Vehículo
                    </label>
                    <input
                      type="text"
                      id="newTipo"
                      name="newTipo"
                      className="form-input w-88 py-1 px-2"
                      value={newTipo}
                      onChange={(e) => setNewTipo(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1 mt-4">
                    <button
                      type="button"
                      className="btn-aceptar w-auto"
                      onClick={() => {
                        if (newTipo.trim()) {
                          // Se agrega el nuevo tipo a las opciones disponibles
                          setTipoVehiculoOptions([
                            ...tipoVehiculoOptions,
                            newTipo.trim(),
                          ]);
                          setNewTipo('');
                          setShowTipoForm(false);
                        } else {
                          alert('Ingrese un tipo válido');
                        }
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar w-auto"
                      onClick={() => {
                        setNewTipo('');
                        setShowTipoForm(false);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
              {/* Formulario emergente para agregar una nueva Marca */}
              {showMarcaForm && (
                <div className="mt-2 p-2 border rounded w-96">
                  <div className="form-group">
                    <label htmlFor="newMarca" className="form-label mt-4">
                      Nueva Marca
                    </label>
                    <input
                      type="text"
                      id="newMarca"
                      name="newMarca"
                      className="form-input w-88 py-1 px-2"
                      value={newMarca}
                      onChange={(e) => setNewMarca(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1 mt-4">
                    <button
                      type="button"
                      className="btn-aceptar w-auto"
                      onClick={() => {
                        if (newMarca.trim()) {
                          // Se agrega la nueva marca a las opciones disponibles
                          setMarcasOptions([...marcasOptions, newMarca.trim()]);
                          setNewMarca('');
                          setShowMarcaForm(false);
                        } else {
                          alert('Ingrese una marca válida');
                        }
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar w-auto"
                      onClick={() => {
                        setNewMarca('');
                        setShowMarcaForm(false);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Sección para visualizar la lista de servicios creados */}
        <div>
          <h2 className="services-title mb-4">Servicios</h2>
          {servicios.length === 0 ? (
            <p className="no-resultados">No hay servicios disponibles.</p>
          ) : (
            <div className="space-y-4">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="service-card p-4">
                  <div className="flex items-center">
                    {/* Muestra la imagen del servicio, si existe */}
                    {servicio.imagen && (
                      <img
                        src={servicio.imagen}
                        alt={servicio.nombre}
                        className="w-24 h-24 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <h3 className="service-card-title">{servicio.nombre}</h3>
                      <p className="service-card-text">{servicio.descripcion}</p>
                      {/* Se unen los tipos de vehículo y marcas con comas para mostrarlos */}
                      <p className="service-card-text">
                        <span className="detalle-label">Tipo:</span>{' '}
                        {servicio.tipoVehiculo.join(', ')}
                      </p>
                      <p className="service-card-text">
                        <span className="detalle-label">Marcas:</span>{' '}
                        {servicio.marcas.join(', ')}
                      </p>
                    </div>
                  </div>
                  {/* Botones para editar o eliminar el servicio */}
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

