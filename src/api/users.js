import { toast } from "react-toastify";
import api from "./axios";


//Funcion para hacer un nuevo registro
export const registerUser = async (userData) => {
  try {
    const response = await api.post('users/register', userData);
    console.log('Usuario registrado:', response.data);
    return response.data;  // Retorna los datos de la respuesta (por ejemplo, el usuario registrado)
  } catch (error) {
    console.error('Error al registrar usuario:', error.response ? error.response.data : error.message);
    throw error;  // Lanzamos el error para manejarlo en el lugar donde se llame esta función
  }
}

//Funcion para enviar un codigo de verificacion al correo del usuario
export const sendVerificationCode2 = async (email) => {
  try {
    const response = await api.post('users/register/send-code', { correo: email });
    console.log('codigo de vericiacion enviado:', response.data);
    return response.data;
  } catch (error) {
    console.error('error al enviar el codigo de verificacion:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export const verifyCode2 = async (email, code) => {
  try {
    const response = await api.post('users/register/verify-code', { email, code });
    console.log('Código verificado correctamente:', response.data);
    // Verificar si la respuesta tiene la propiedad success
    return response.data;
  } catch (error) {
    console.error('error al verificar el codigo:', error.response ? error.response.data : error.message);
    throw error;
  }
}



//Funcion para iniciar sesion
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('users/login', credentials);
    console.log('Inicio de sesion exitodo:', response.data);

    //Asegurar de guardar el token recibido
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      console.log('Token guardado en el localStorage')
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      // Verifica si el error es un 400
      if (error.response.status === 400) {
        console.error('Error 400 - Solicitud incorrecta:', error.response.data);
        // Redirige a la vista específica
        window.location.href = 'http://localhost:3001/400';
        return; // Finaliza la ejecución después de la redirección
      }
    }
    // Manejo genérico de errores
    console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);

    throw error;
  }
}

//Funcion para enviar un codigo de verificacion al correo del usuario
export const sendVerificationCode = async (email) => {
  try {
    const response = await api.post('users/recover-password/send-code', { correo: email });
    console.log('codigo de vericiacion enviado:', response.data);
    return response.data;
  } catch (error) {
    console.error('error al enviar el codigo de verificacion:', error.response ? error.response.data : error.message);
    throw error;
  }
}

//Funcion para verificar el codigo de verificacion recibido por el usuario
export const verifyCode = async (email, code) => {
  try {
    const response = await api.post('users/recover-password/verify-code', { email, code });
    console.log('codigo verificado correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('error al verificar el codigo:', error.response ? error.response.data : error.message);
    throw error;
  }
}

//Funcion para restablcer la contraseña despues de verificar el codigo
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post('users/recover-password/reset', { email, newPassword });
    console.log('contraseña restablecida exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Función para enviar feedback
export const sendFeedback = async (feedbackData) => {
  try {
    const response = await api.post('users/feedback', feedbackData);  // Reemplaza 'feedback' con la ruta correcta en tu backend
    console.log('Feedback enviado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar feedback:', error.response ? error.response.data : error.message);

    throw error;
  }
}
