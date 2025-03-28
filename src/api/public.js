import { toast } from 'react-toastify';
import api from './axios';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/public/register', userData);
        console.log('Usuario registrado:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error al registrar usuario:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

//Funcion para enviar un codigo de verificacion al correo del usuario
export const sendVerificationCode = async (email) => {
    try {
        const response = await api.post('public/register/send-verification-code', {
            correo: email,
        });
        console.log('codigo de vericación enviado:', response.data);
        return response.data;
    } catch (error) {
        toast.error('El correo ya está en uso');
        console.error(
            'error al enviar el codigo de verificacion:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

export const verifyCode = async ({ correo, code }) => {
    try {
        const response = await api.post('/public/register/verify-code', {
            correo, // Ahora enviamos la propiedad "correo"
            code,   // Y la propiedad "code"
        });
        console.log('Código verificado correctamente:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error al verificar el código:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};


export const login = async (loginData) => {
    try {
        const response = await api.post(
            '/public/login',
            loginData,
            { withCredentials: true } // Corrección aplicada aquí
        );
        return response.data;
    } catch (error) {
        return null; // Indicar que la autenticación falló
    }
}

export const getUserInfo = async (userData) => {
    try {
        const response = await api.get(`/public/${userData}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('Error 400: Solicitud inválida.', error.response.data);
        } else {
            console.error('Error inesperado:', error);
            //alert('Ocurrió un error inesperado.');
        }
        throw error;
    }
}

export const getRole = async (userData) => {
    try {
        const response = await api.get(`/public/${userData}/role`, {
            withCredentials: true, // 🔥 Asegurar que se envíen las cookies
        });
        console.log('Rol recibido:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        alert('Ocurrió un error inesperado.');
    }
};


export const findUser = async (correo) => {
    try {
        const response = await api.post('/public/recover-password/find-user', { correo }); // Enviar como objeto
        return response.data; // Devolver solo data
    } catch (error) {
        console.error('Error inesperado:', error);
        return { success: false, message: 'Error en la búsqueda del usuario' }; // Devolver objeto en error
    }
};


export const sendPasswordResetVerificationCode = async (email, idPreguntaSecreta, respuestaSecreta) => {
    try {
        const response = await api.post('/public/recover-password/send-verification-code', {
            correo: email,
            idPreguntaSecreta: idPreguntaSecreta,
            respuestaSecreta: respuestaSecreta
        });

        console.log('Código de verificación enviado:', response.data);
        return response.data;

    } catch (error) {
        toast.error('Los datos ingresados no son correctos o el usuario no existe');
        console.error(
            'Error al enviar el código de verificación:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};


export const verifyPasswordResetCode = async (correo, code) => {
    try {
        const response = await api.post('/public/recover-password/verify-code', {
            correo,
            code,
        });
        console.log('Código verificado correctamente:', response.data);
        // Verificar si la respuesta tiene la propiedad success
        return response.data;
    } catch (error) {
        console.error(
            'error al verificar el codigo:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

export const resetPassword = async (correo, newPassword) => {
    try {
        const response = await api.post('/public/recover-password/reset', {
            correo,
            newPassword,
        });
        console.log('contraseña restablecida exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Error al restablecer la contraseña:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

export const getAllQuestions = async () => {
    try {
        const response = await api.get('/public/questions/secret');
        return response.data;
    } catch (error) {
        console.error(
            'Error al obtener las preguntas:',
            error.response ? error.response.data : error.message
        )
    }
}
