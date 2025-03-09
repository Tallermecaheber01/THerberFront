import api from './axios';

const handleError = (error, functionName) => {
  console.error(
    `Error en ${functionName}:`,
    error.response?.data || error.message
  );
  return { success: false, error: error.response?.data || error.message };
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post('/admin/new-service', serviceData);
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    return handleError(error, 'createService');
  }
};

export const createVehicleType = async (vehicleData) => {
  try {
    const response = await api.post('/admin/new-vehicletype', vehicleData);
    return response.data;
  } catch (error) {
    return handleError(error, 'createVehicleType');
  }
};

export const createBrand = async (brandData) => {
  try {
    const response = await api.post('/admin/new-brand', brandData);
    return response.data;
  } catch (error) {
    return handleError(error, 'createBrand');
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.patch(
      `/admin/update-service/${serviceId}`,
      serviceData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'updateService');
  }
};

export const updateVehicleType = async (vehicleId, vehicleData) => {
  try {
    const response = await api.patch(
      `/admin/update-vehicletype/${vehicleId}`,
      vehicleData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'updateVehicleType');
  }
};

export const updateBrand = async (brandId, brandData) => {
  try {
    const response = await api.patch(
      `/admin/update-brand/${brandId}`,
      brandData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'updateBrand');
  }
};

export const getAllServices = async () => {
  try {
    const response = await api.get('/admin/all-services');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllServices');
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/admin/service/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getServiceById');
  }
};

export const getAllVehicleTypes = async () => {
  try {
    const response = await api.get('/admin/all-vehicletypes');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllVehicleTypes');
  }
};

export const getAllBrands = async () => {
  try {
    const response = await api.get('/admin/all-brands');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllBrands');
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/admin/delete-service/${id}`);
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    return handleError(error, 'deleteService');
  }
};

export const deleteVehicleType = async (id) => {
  try {
    const response = await api.delete(`/admin/delete-vehicletype/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'deleteVehicleType');
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await api.delete(`/admin/delete-brand/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'deleteBrand');
  }
};
