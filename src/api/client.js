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
