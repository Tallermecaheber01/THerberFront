import React, { useState, useRef, useEffect } from 'react';

import { createBrand, createService, createVehicleType } from '../../api/admin';
import { getAllServices, getAllBrands, getAllVehicleTypes } from '../../api/admin';
import { updateService, updateBrand, updateVehicleType } from '../../api/admin';
import { deleteService, deleteBrand, deleteVehicleType } from '../../api/admin';

function CrudServicios() {
  // Estado para almacenar la lista de servicios creados.
  const [servicios, setServicios] = useState([]);

  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [reload, setReload] = useState(false);



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
  const [editingTipoIndex, setEditingTipoIndex] = useState(null);
  const [editingTipoValue, setEditingTipoValue] = useState('');
  const [editingMarcaIndex, setEditingMarcaIndex] = useState(null);
  const [editingMarcaValue, setEditingMarcaValue] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        console.log("Servicios obtenidos:", servicesData);
        setServices(servicesData);

        const brandsData = await getAllBrands();
        console.log('Marcas obtenidas:', brandsData);
        setBrands(brandsData);

        const vehiclesData = await getAllVehicleTypes();
        console.log("Tipos de vehiculos obtenidos:", vehiclesData);
        setVehicleTypes(vehiclesData);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
    fetchData();
  }, [reload])

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
    console.log("Tipo seleccionado antes de agregar:", selectedTipoVehiculo);
    console.log("Tipos de vehículo actuales en estado:", datosServicio.tipoVehiculo);
    const vehicle = vehicleTypes.find(v => v.id === parseInt(selectedTipoVehiculo, 10));

    if (!vehicle) {
      console.log("No se encontró el tipo de vehículo.");
      return;
    }

    console.log("Hola", vehicle.nombre);

    // Verifica si el ID ya está en la lista
    if (!datosServicio.tipoVehiculo.includes(vehicle.id)) {
      console.log("Estado actualizado con el nuevo tipo:", [
        ...datosServicio.tipoVehiculo,
        vehicle.id,
      ]);

      setDatosServicio((prev) => ({
        ...prev,
        tipoVehiculo: [...prev.tipoVehiculo, vehicle.id], // Guarda solo el ID
      }));
    }

    // Se reinicia el valor del select
    setSelectedTipoVehiculo('');
  };

  const agregarTipoVehiculoAPI = async (newTipo) => {
    const vehicleData = { nombre: newTipo };

    try {
      // Llamada a la API para agregar el tipo de vehículo
      const response = await createVehicleType(vehicleData);
      console.log("Nuevo tipo de vehículo agregado:", response);

      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);
    } catch (error) {
      console.error('Error al agregar tipo de vehículo:', error);
      alert("Ocurrió un error al intentar agregar el tipo de vehículo.");
    }
  };


  // Función para eliminar un tipo de vehículo ya agregado.
  const eliminarTipoVehiculo = (tipo) => {
    setDatosServicio((prev) => ({
      ...prev,
      tipoVehiculo: prev.tipoVehiculo.filter((item) => item !== tipo),
    }));
  };

  // Función para iniciar la edición de un tipo
  const handleEditTipo = (index) => {
    setEditingTipoIndex(index);
    setEditingTipoValue(vehicleTypes[index].nombre);
  };

  // Función para guardar el cambio en un tipo
  const handleSaveTipo = async (index) => {
    try {
      const vehicleId = vehicleTypes[index].id;
      const updateVehiculo = { nombre: editingTipoValue };
      const response = await updateVehicleType(vehicleId, updateVehiculo);
      console.log('Tipo de vehiculo actualizado:', response);
      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);

      setEditingTipoIndex(null);
      setEditingTipoValue('');
    } catch (error) {
      console.error('Error al guardar el tipo de vehiculo:', error);
      alert('Ocurrió un error al intentar guardar el tipo de vehiculo.');
    }
  };

  // Función para eliminar un tipo
  const handleDeleteTipo = async (index) => {
    try {
      const vehicleId = vehicleTypes[index].id;
      const response = await deleteVehicleType(vehicleId);
      console.log('Tipo de vehiculo eliminado');
      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);

    } catch (error) {
      console.error('Error al eliminar el tipo de vehiculo:', error);
      alert('Ocurrió un error al intentar eliminar el tipo de vehiculo.');
    }
  };

  // Función para agregar una marca a la lista de marcas seleccionadas.
  const agregarMarca = () => {
    console.log("Marca seleccionada antes de agregar:", selectedMarca);
    console.log("Marcas actuales en estado:", datosServicio.marcas);
    const brand = brands.find(v => v.id === parseInt(selectedMarca, 10));

    if (!brand) {
      console.log("No se encontro ninguna marca")
    }
    console.log("Hola marca:", brand.nombre)
    if (!datosServicio.marcas.includes(brand.id)) {
      console.log("Estado actualizado con la nueva marca:", [
        ...datosServicio.marcas,
        brand.id,
      ])

      setDatosServicio((prev) => ({
        ...prev,
        marcas: [...prev.marcas, brand.id],
      }))
    }

    // Se reinicia el select de marcas
    setSelectedMarca('');
  };

  const agregarMarcaAPI = async (newMarca) => {
    const brandData = { nombre: newMarca };

    try {
      const response = await createBrand(brandData);
      console.log("Nueva marca:", response);
      // Obtener las marcas nuevamente
      const brandsData = await getAllBrands();
      setBrands(brandsData);  // Actualiza el estado con las nuevas marcas
    } catch (error) {
      console.log('Error al agregar tipo de vehiculo:', error);
      alert("Ocussio un error al intentar agregar el tipo de vehículo.");
    }
  }
  // Función para eliminar una marca ya agregada.
  const eliminarMarca = (marca) => {

    setDatosServicio((prev) => ({
      ...prev,
      marcas: prev.marcas.filter((item) => item !== marca),
    }));
  };

  const handleEditMarca = (index) => {
    setEditingMarcaIndex(index);
    setEditingMarcaValue(brands[index].nombre);
  };

  // Función para guardar el cambio en una marca
  const handleSaveMarca = async (index) => {
    try {
      const brandId = brands[index].id;
      const updateMarca = { nombre: editingMarcaValue };
      const response = await updateBrand(brandId, updateMarca);
      console.log('Marca actualizada:', response);
      const brandsData = await getAllBrands();
      setBrands(brandsData);  // Actualiza el estado con las nuevas marcas
      // Restablecemos los valores de edición
      setEditingMarcaIndex(null);
      setEditingMarcaValue('');
    } catch (error) {
      console.error('Error al guardar la marca:', error);
      alert('Ocurrió un error al intentar guardar la marca.');
    }
  };

  // Función para eliminar una marca
  const handleDeleteMarca = async (index) => {
    try {
      const brandId = brands[index].id;
      const response = await deleteBrand(brandId);
      console.log("Marca eliminada:", response)
      const brandsData = await getAllBrands();
      setBrands(brandsData);  // Actualiza el estado con las nuevas marcas
    } catch (error) {
      console.error('Error al eliminar la marca:', error);
      alert('Ocurrió un error al intentar eliminar la marca.');
    }
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
      tipoVehiculo: [...datosServicio.tipoVehiculo],
      marcas: [...datosServicio.marcas],
      imagen: imagenUrl,
      id: modoEdicion ? idEdicion : Date.now(),
    };

    const service = {
      nombre: datosServicio.nombre,
      descripcion: datosServicio.descripcion,
      tipoVehiculo: [...datosServicio.tipoVehiculo],
      marcas: [...datosServicio.marcas],
      imagen: imagenUrl
    }


    // Si estamos en modo edición, se actualiza el servicio existente.
    // Caso contrario, se agrega el nuevo servicio a la lista.
    try {
      let response;
      if (modoEdicion) {
        console.log("Este es el id", idEdicion)
        response = await updateService(idEdicion, service);
        console.log(response)

        // Actualizar el estado con la información editada
        setServices((prevServices) =>
          prevServices.map((s) => (s.id === idEdicion ? response : s))
        );

        /*setServicios(
          servicios.map((s) => (s.id === idEdicion ? nuevoServicio : s))
        );*/
        setModoEdicion(false);
        setIdEdicion(null);
      } else {
        //setServicios([...servicios, nuevoServicio]);
        response = await createService(service);
        setServices((prevServices) => [...prevServices, response]);
      }
      setReload(prev => !prev);
      console.log(response)

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
    } catch (error) {
      console.error('Error en el manejo del servicio:', error);
    }




  };

  // Función para iniciar la edición de un servicio.
  // Se carga la información del servicio en el formulario y se activa el modo edición.
  const editarServicio = (servicio) => {
    console.log("Estas editando")
    console.log(servicio.id)
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
  const eliminarServicio = async (id) => {
    const confimar = window.confirm("Estas seguro de que quieres eliminar este servicio?");
    if (!confimar) return;
    try {
      await deleteService(id);
      setServices((prevServices) => prevServices.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
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
                  {vehicleTypes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}> {/* Aquí accedes a tipo.id para el value y tipo.nombre para mostrar el nombre */}
                      {tipo.nombre}
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
                {datosServicio.tipoVehiculo.map((tipoId, index) => {
                  const tipo = vehicleTypes.find(v => v.id === tipoId);
                  return (
                    <span key={index} className="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
                      {tipo ? tipo.nombre : "Desconocido"} {/* Muestra el nombre en lugar del ID */}
                      <button type="button" onClick={() => eliminarTipoVehiculo(tipoId)}>
                        x
                      </button>
                    </span>
                  );
                })}
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
                  {brands.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
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
                {datosServicio.marcas.map((marcaId, index) => {
                  const marca = brands.find(v => v.id === marcaId);
                  return (
                    <span key={index} className="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
                      {marca ? marca.nombre : "Desconocido"}
                      <button
                        type="button"
                        onClick={() => eliminarMarca(marcaId)}
                      >
                        x
                      </button>
                    </span>
                  )

                })}
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
                        agregarTipoVehiculoAPI(newTipo)
                        if (newTipo.trim()) {
                          // Se agrega el nuevo tipo a las opciones disponibles

                          setTipoVehiculoOptions([
                            ...tipoVehiculoOptions,
                            newTipo.trim(),
                          ]);
                          setNewTipo('');
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
                  <div className="mt-4">
                    <h4 className="detalle-label">Tipos de Vehículo Disponibles</h4>
                    {vehicleTypes.map((tipo, index) => (
                      <div key={index} className="service-card-text flex items-center justify-between my-1">
                        {editingTipoIndex === index ? (
                          <>
                            {/* Contenedor con ancho fijo para el input en modo edición */}
                            <div className="w-40">
                              <input
                                type="text"
                                value={editingTipoValue}
                                onChange={(e) => setEditingTipoValue(e.target.value)}
                                className="form-input w-full"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="btn-aceptar w-20"
                                onClick={() => handleSaveTipo(index)}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="btn-cancelar w-20"
                                onClick={() => setEditingTipoIndex(null)}
                              >
                                Cancelar
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Contenedor con ancho fijo para el texto */}
                            <span className="w-40">{tipo.nombre}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="btn-aceptar w-20"
                                onClick={() => handleEditTipo(index)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn-cancelar w-20"
                                onClick={() => handleDeleteTipo(index)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
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
                        agregarMarcaAPI(newMarca);
                        if (newMarca.trim()) {
                          // Se agrega la nueva marca a las opciones disponibles
                          setMarcasOptions([...marcasOptions, newMarca.trim()]);
                          setNewMarca('');
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
                  {/* Aquí se muestra la lista de marcas con opción para editar y eliminar */}
                  <div className="mt-4">
                    <h4 className="detalle-label">Marcas Disponibles</h4>
                    {brands.length > 0 ? (
                      brands.map((marca, index) => (
                        <div key={marca.id} className="service-card-text flex items-center justify-between my-1">
                          {editingMarcaIndex === index ? (
                            <>
                              {/* Contenedor con ancho fijo para el input en modo edición */}
                              <div className="w-40">
                                <input
                                  type="text"
                                  value={editingMarcaValue}
                                  onChange={(e) => setEditingMarcaValue(e.target.value)}
                                  className="form-input w-full"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="btn-aceptar w-20"
                                  onClick={() => handleSaveMarca(index)}
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  className="btn-cancelar w-20"
                                  onClick={() => setEditingMarcaIndex(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Contenedor con ancho fijo para el texto */}
                              <span className="w-40">{marca.nombre}</span> {/* Aquí se accede a 'nombre' */}
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="btn-aceptar w-20"
                                  onClick={() => handleEditMarca(index)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="btn-cancelar w-20"
                                  onClick={() => handleDeleteMarca(index)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>No hay marcas disponibles</div> // Mensaje si no hay marcas
                    )}
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
        {/* Sección para visualizar la lista de servicios creados */}
        <div>
          <h2 className="services-title mb-4">Servicios</h2>
          {services.length === 0 ? (
            <p className="no-resultados">No hay servicios disponibles.</p>
          ) : (
            <div className="space-y-4">
              {services.map((servicio) => (
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
                        {Array.isArray(servicio.tipoVehiculo) ? servicio.tipoVehiculo.join(', ') : 'No especificado'}
                      </p>
                      <p className="service-card-text">
                        <span className="detalle-label">Marcas:</span>{' '}
                        {Array.isArray(servicio.marcas) ? servicio.marcas.join(', ') : 'No especificado'}
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

