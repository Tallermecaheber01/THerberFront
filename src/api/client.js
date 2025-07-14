import api from './axios';

export const getUserInfo = async (id) => {
  try {
    const response = await api.get(`/client/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error('Error 400: Solicitud inválida.', error.response.data);
    } else {
      console.error('Error inesperado:', error);
      alert('Ocurrió un error inesperado.');
    }
    throw error;
  }
};

export const getRole = async (id) => {
  try {
    const response = await api.get(`/client/${id}/role`);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
};

export const createNewVehicle = async (vehicleData) => {
  try {
    const response = await api.post('/client/new-vehicle', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const getAllBrands = async () => {
  try {
    const response = await api.get('/client/brands');
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const getVehicles = async () => {
  try {
    const response = await api.get(`/client/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await api.put(`/client/update-vehicle/${vehicleId}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await api.delete(`/client/delete-vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const getAppointments = async () => {
  try {
    const response = await api.get('/client/appointments');
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const getRepairPay = async () => {
  try {
    const response = await api.get('/client/payment');
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Ocurrió un error inesperado.');
  }
}

export const createPaymentOrder = async (orden) => {
  try {
    const response = await api.post('/mercado-pago/create-order', orden); // sin body
    return response.data; // { id, init_point }
  } catch (error) {
    console.error('Error creando la orden de pago:', error);
    alert('No se pudo iniciar el pago, intenta de nuevo.');
    throw error;
  }
};

export const setRepairInProcess = async (repairId) => {
  try {
    const response = await api.put(`/client/repair/${repairId}/set-in-process`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar reparación como en proceso:', error);
    alert('No se pudo actualizar el estado de la reparación.');
    throw error;
  }
};

export const getRepairHistory = async () => {
  try {
    const response = await api.get('/client/repair-history');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el historial de reparaciones:', error);
    alert('No se pudo obtener el historial de reparaciones.');
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/client/appointments', appointmentData);
    return response.data; // Aquí podrías recibir el idCita o el objeto completo
  } catch (error) {
    console.error('Error al crear la cita:', error);
    alert('No se pudo crear la cita, intenta nuevamente.');
    throw error;
  }
};

export const getAppointmentById = async (idCita) => {
  try {
    const response = await api.get(`/client/appointments/${idCita}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    alert('No se pudo obtener la cita.');
    throw error;
  }
};

export const updateAppointmentDate = async (idCita, datos) => {
  try {
    const response = await api.patch(`/client/appointments/${idCita}/fecha`, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar fecha/hora de la cita:', error);
    alert('No se pudo actualizar la fecha de la cita.');
    throw error;
  }
};

export const cancelAppointment = async (idCita, cancelData) => {
  try {
    const response = await api.post(`/client/appointments/${idCita}/cancel`, cancelData);
    return response.data;
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    alert('No se pudo cancelar la cita. Intenta nuevamente.');
    throw error;
  }
};


