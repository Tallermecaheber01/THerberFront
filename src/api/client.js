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

export const generateSmartwatchCode = async (id) => {
  try {
    const response = await api.post(`/client/${id}/generar-codigo-smartwatch`);
    return response.data.code;
  } catch (error) {
    console.error('Error al generar código smartwatch:', error);
    throw error;
  }
};

export const sendFeedback = async (clientId, data) => {
  try {
    const response = await api.post(`/client/${clientId}/feedback`, data);
    return response.data; // FeedbackEntity enviado por el servidor
  } catch (error) {
    console.error('Error al enviar feedback:', error);
    throw error;
  }
};