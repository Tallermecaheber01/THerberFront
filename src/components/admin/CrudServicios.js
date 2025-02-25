import React, { useState, useRef, useEffect } from "react";
import { createBrand, createService, createVehicleType } from "../../api/admin";
import { getAllServices, getAllBrands, getAllVehicleTypes } from "../../api/admin";
import { updateService, updateBrand, updateVehicleType } from "../../api/admin";
import { deleteService, deleteBrand, deleteVehicleType } from "../../api/admin";

function CrudServicios() {
  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [reload, setReload] = useState(false);

  const [datosServicio, setDatosServicio] = useState({
    nombre: "",
    descripcion: "",
    tipoVehiculo: [],
    marcas: [],
    imagen: null,
  });

  const [selectedTipoVehiculo, setSelectedTipoVehiculo] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const fileInputRef = useRef(null);
  const [editingTipoIndex, setEditingTipoIndex] = useState(null);
  const [editingTipoValue, setEditingTipoValue] = useState("");
  const [editingMarcaIndex, setEditingMarcaIndex] = useState(null);
  const [editingMarcaValue, setEditingMarcaValue] = useState("");

  const [marcasOptions, setMarcasOptions] = useState([
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Otro",
  ]);
  const [tipoVehiculoOptions, setTipoVehiculoOptions] = useState([
    "Automóvil",
    "Camioneta",
    "Motocicleta",
    "Otro",
  ]);

  // Estados para los modales de confirmación (ya definidos en tu código)
  const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Nuevo estado para almacenar errores del formulario
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);

        const brandsData = await getAllBrands();
        setBrands(brandsData);

        const vehiclesData = await getAllVehicleTypes();
        setVehicleTypes(vehiclesData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, [reload]);

  const [showMarcaForm, setShowMarcaForm] = useState(false);
  const [newMarca, setNewMarca] = useState("");

  const [showTipoForm, setShowTipoForm] = useState(false);
  const [newTipo, setNewTipo] = useState("");

  // Validación para evitar caracteres potencialmente peligrosos
  const isInputSeguro = (value) => {
    if (
      value.includes("'") ||
      value.includes('"') ||
      value.includes(";") ||
      value.includes("--") ||
      value.includes("/*") ||
      value.includes("*/")
    ) {
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "nombre" || name === "descripcion") {
      if (!isInputSeguro(value)) {
        return;
      }
    }
    if (name === "imagen") {
      if (files[0]) {
        const archivo = files[0];
        if (
          !archivo.name.toLowerCase().endsWith(".jpg") ||
          archivo.type !== "image/jpeg"
        ) {
          e.target.value = "";
          setDatosServicio({ ...datosServicio, imagen: null });
          return;
        }
        setDatosServicio({ ...datosServicio, imagen: archivo });
      } else {
        setDatosServicio({ ...datosServicio, imagen: null });
      }
    } else {
      setDatosServicio({ ...datosServicio, [name]: value });
    }
  };

  const agregarTipoVehiculo = () => {
    const vehicle = vehicleTypes.find(
      (v) => v.id === parseInt(selectedTipoVehiculo, 10)
    );
    if (vehicle) {
      if (!datosServicio.tipoVehiculo.includes(vehicle.nombre)) {
        setDatosServicio((prev) => ({
          ...prev,
          tipoVehiculo: [...prev.tipoVehiculo, vehicle.nombre],
        }));
      } else {
      }
    }
    setSelectedTipoVehiculo("");
  };

  const agregarTipoVehiculoAPI = async (newTipo) => {
    const vehicleData = { nombre: newTipo };

    try {
      const response = await createVehicleType(vehicleData);
      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);
    } catch (error) {
    }
  };

  const eliminarTipoVehiculo = (tipo) => {
    setDatosServicio((prev) => ({
      ...prev,
      tipoVehiculo: prev.tipoVehiculo.filter((item) => item !== tipo),
    }));
  };

  const handleEditTipo = (index) => {
    setEditingTipoIndex(index);
    setEditingTipoValue(vehicleTypes[index].nombre);
  };

  const handleSaveTipo = async (index) => {
    try {
      const vehicleId = vehicleTypes[index].id;
      const updateVehiculo = { nombre: editingTipoValue };
      const response = await updateVehicleType(vehicleId, updateVehiculo);
      console.log("Tipo de vehículo actualizado:", response);
      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);

      setEditingTipoIndex(null);
      setEditingTipoValue("");
    } catch (error) {
    }
  };

  const handleDeleteTipo = async (index) => {
    try {
      const vehicleId = vehicleTypes[index].id;
      const response = await deleteVehicleType(vehicleId);
      console.log("Tipo de vehículo eliminado", response);
      const vehiclesData = await getAllVehicleTypes();
      setVehicleTypes(vehiclesData);
    } catch (error) {
    }
  };

  const agregarMarca = () => {
    const brand = brands.find((v) => v.id === parseInt(selectedMarca, 10));
    if (brand) {
      if (!datosServicio.marcas.includes(brand.nombre)) {
        setDatosServicio((prev) => ({
          ...prev,
          marcas: [...prev.marcas, brand.nombre],
        }));
      } else {
      }
    }
    setSelectedMarca("");
  };

  const agregarMarcaAPI = async (newMarca) => {
    const brandData = { nombre: newMarca };

    try {
      const response = await createBrand(brandData);
      console.log("Nueva marca:", response);
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    } catch (error) {
    }
  };

  const eliminarMarca = (marca) => {
    setDatosServicio((prev) => ({
      ...prev,
      marcas: prev.marcas.filter((item) => item !== marca),
    }));
  };

  const handleSaveMarca = async (index) => {
    try {
      const brandId = brands[index].id;
      const updateMarca = { nombre: editingMarcaValue };
      const response = await updateBrand(brandId, updateMarca);
      console.log("Marca actualizada:", response);
      const brandsData = await getAllBrands();
      setBrands(brandsData);
      setEditingMarcaIndex(null);
      setEditingMarcaValue("");
    } catch (error) {
    }
  };

  const handleDeleteMarca = async (index) => {
    try {
      const brandId = brands[index].id;
      const response = await deleteBrand(brandId);
      console.log("Marca eliminada:", response);
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    } catch (error) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario: se muestran mensajes de error en línea
    const errors = {};
    if (!datosServicio.nombre.trim()) {
      errors.nombre = "El nombre del servicio es obligatorio.";
    }
    if (!datosServicio.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria.";
    }
    if (datosServicio.tipoVehiculo.length === 0) {
      errors.tipoVehiculo = "Debe seleccionar al menos un tipo de vehículo.";
    }
    if (datosServicio.marcas.length === 0) {
      errors.marcas = "Debe seleccionar al menos una marca.";
    }
    if (!datosServicio.imagen) {
      errors.imagen = "Debe subir una imagen en formato .jpg.";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    let imagenUrl = datosServicio.imagen;
    if (datosServicio.imagen && datosServicio.imagen instanceof File) {
      const formData = new FormData();
      formData.append("file", datosServicio.imagen);
      formData.append("upload_preset", "taller_heber_servicios");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dtcjmtiwy/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        imagenUrl = data.secure_url;
      } catch (error) {
        console.error("Error al subir imagen:", error);
      }
    }
    if (!imagenUrl) {
      // Este caso no debería pasar ya que se valida previamente
      setFormErrors((prev) => ({
        ...prev,
        imagen: "Debe subir una imagen en formato .jpg.",
      }));
      return;
    }

    const service = {
      nombre: datosServicio.nombre,
      descripcion: datosServicio.descripcion,
      tipoVehiculo: [...datosServicio.tipoVehiculo],
      marcas: [...datosServicio.marcas],
      imagen: imagenUrl,
    };

    try {
      let response;
      if (modoEdicion) {
        response = await updateService(idEdicion, service);
        setServices((prevServices) =>
          prevServices.map((s) => (s.id === idEdicion ? response : s))
        );
        setModoEdicion(false);
        setIdEdicion(null);
      } else {
        response = await createService(service);
        setServices((prevServices) => [...prevServices, response]);
      }
      setReload((prev) => !prev);

      setDatosServicio({
        nombre: "",
        descripcion: "",
        tipoVehiculo: [],
        marcas: [],
        imagen: null,
      });
      setSelectedTipoVehiculo("");
      setSelectedMarca("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error en el manejo del servicio:", error);
    }
  };

  // Función para iniciar el modo edición (se invoca tras confirmar en el modal)
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

  // Función para eliminar el servicio (se llama tras confirmar en el modal)
  const eliminarServicio = async (id) => {
    try {
      await deleteService(id);
      setServices((prevServices) => prevServices.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="form-title mb-4">Administrar Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleSubmit} className="form-card">
            <h2 className="form-title mb-4">
              {modoEdicion ? "Editar Servicio" : "Agregar Servicio"}
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
              {formErrors.nombre && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.nombre}
                </p>
              )}
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
              {formErrors.descripcion && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.descripcion}
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Vehículo</label>
              <div className="flex items-center">
                <select
                  value={selectedTipoVehiculo}
                  onChange={(e) => setSelectedTipoVehiculo(e.target.value)}
                  className="form-input"
                >
                  <option value="">Seleccione un tipo</option>
                  {vehicleTypes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={agregarTipoVehiculo}
                  className="btn-aceptar ml-2"
                >
                  Agregar
                </button>
              </div>
              <div className="mt-2">
                {datosServicio.tipoVehiculo.map((tipoNombre, index) => {
                  const tipo = vehicleTypes.find(
                    (v) => v.nombre === tipoNombre
                  );
                  return (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded px-2 py-1 mr-2"
                    >
                      {tipo ? tipo.nombre : "Desconocido"}
                      <button
                        type="button"
                        onClick={() => eliminarTipoVehiculo(tipoNombre)}
                      >
                        x
                      </button>
                    </span>
                  );
                })}
              </div>
              {formErrors.tipoVehiculo && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.tipoVehiculo}
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Marcas</label>
              <div className="flex items-center">
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
                <button
                  type="button"
                  onClick={agregarMarca}
                  className="btn-aceptar ml-2"
                >
                  Agregar
                </button>
              </div>
              <div className="mt-2">
                {datosServicio.marcas.map((marcaNombre, index) => {
                  const marca = brands.find((v) => v.nombre === marcaNombre);
                  return (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded px-2 py-1 mr-2"
                    >
                      {marca ? marca.nombre : "Desconocido"}
                      <button
                        type="button"
                        onClick={() => eliminarMarca(marcaNombre)}
                      >
                        x
                      </button>
                    </span>
                  );
                })}
              </div>
              {formErrors.marcas && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.marcas}
                </p>
              )}
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
                ref={fileInputRef}
              />
              {formErrors.imagen && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.imagen}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-aceptar">
                {modoEdicion ? "Guardar Cambios" : "Agregar Servicio"}
              </button>
              {modoEdicion && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setModoEdicion(false);
                    setIdEdicion(null);
                    setDatosServicio({
                      nombre: "",
                      descripcion: "",
                      tipoVehiculo: [],
                      marcas: [],
                      imagen: null,
                    });
                    setSelectedTipoVehiculo("");
                    setSelectedMarca("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {(!showTipoForm && !showMarcaForm) ? (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="btn-aceptar w-auto text-sm py-2 px-1"
                onClick={() => setShowTipoForm(true)}
              >
                Agregar Tipo de Vehículo
              </button>
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
                        agregarTipoVehiculoAPI(newTipo);
                        if (newTipo.trim()) {
                          setTipoVehiculoOptions([
                            ...tipoVehiculoOptions,
                            newTipo.trim(),
                          ]);
                          setNewTipo("");
                        } 
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar w-auto"
                      onClick={() => {
                        setNewTipo("");
                        setShowTipoForm(false);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                  <div className="mt-4">
                    <h4 className="detalle-label">Tipos de Vehículo Disponibles</h4>
                    {vehicleTypes.map((tipo, index) => (
                      <div
                        key={index}
                        className="service-card-text flex items-center justify-between my-1"
                      >
                        {editingTipoIndex === index ? (
                          <>
                            <div className="w-40">
                              <input
                                type="text"
                                value={editingTipoValue}
                                onChange={(e) =>
                                  setEditingTipoValue(e.target.value)
                                }
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
                          setMarcasOptions([...marcasOptions, newMarca.trim()]);
                          setNewMarca("");
                        } 
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      className="btn-cancelar w-auto"
                      onClick={() => {
                        setNewMarca("");
                        setShowMarcaForm(false);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                  <div className="mt-4">
                    <h4 className="detalle-label">Marcas Disponibles</h4>
                    {brands.length > 0 ? (
                      brands.map((marca, index) => (
                        <div
                          key={marca.id}
                          className="service-card-text flex items-center justify-between my-1"
                        >
                          {editingMarcaIndex === index ? (
                            <>
                              <div className="w-40">
                                <input
                                  type="text"
                                  value={editingMarcaValue}
                                  onChange={(e) =>
                                    setEditingMarcaValue(e.target.value)
                                  }
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
                              <span className="w-40">{marca.nombre}</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="btn-aceptar w-20"
                                  onClick={() => {
                                    setServiceToEdit(marca);
                                    setEditingMarcaIndex(index);
                                  }}
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
                      <div>No hay marcas disponibles</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <h2 className="services-title mb-4">Servicios</h2>
          {services.length === 0 ? (
            <p className="no-resultados">No hay servicios disponibles.</p>
          ) : (
            <div className="space-y-4">
              {services.map((servicio) => (
                <div key={servicio.id} className="service-card p-4 card-transition">
                  <div className="flex items-center">
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
                      <p className="service-card-text">
                        <span className="detalle-label">Tipo:</span>{" "}
                        {Array.isArray(servicio.tipoVehiculo)
                          ? servicio.tipoVehiculo.join(", ")
                          : "No especificado"}
                      </p>
                      <p className="service-card-text">
                        <span className="detalle-label">Marcas:</span>{" "}
                        {Array.isArray(servicio.marcas)
                          ? servicio.marcas.join(", ")
                          : "No especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setServiceToEdit(servicio);
                        setShowConfirmEditModal(true);
                      }}
                      className="button-yellow"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setServiceToDelete(servicio);
                        setShowConfirmDeleteModal(true);
                      }}
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

      {/* Modal de confirmación para editar */}
      {showConfirmEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              Confirmación de Edición
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que deseas editar este servicio?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn-aceptar"
                onClick={() => {
                  setShowConfirmEditModal(false);
                  editarServicio(serviceToEdit);
                }}
              >
                Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowConfirmEditModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              Confirmación de Eliminación
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que deseas eliminar este servicio?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn-aceptar"
                onClick={() => {
                  setShowConfirmDeleteModal(false);
                  eliminarServicio(serviceToDelete.id);
                }}
              >
                Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrudServicios;
