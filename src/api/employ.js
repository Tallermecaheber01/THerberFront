import api from "./axios";

const handleError = (error, functionName) => {
    console.error(`Error en ${functionName}:`, error.response?.data || error.message);
    alert(error.response?.data?.message || 'Ocurrio un error inesperado.');
    return { success: false, error: error.response?.data || error.message };
};

export const createNewAppointment = async (appointmentData) => {
    try {
        const response = await api.post('/employ/new-appointment', appointmentData);
        return response.data;
    } catch (error) {
        return handleError(error, 'createNewAppointment')
    }
}

export const getAllAppointments = async () => {
    try {
        const response = await api.get('employ/all-appointmens');
        return response.data
    } catch (error) {
        return handleError(error,'getAllApointments');
    }
}
