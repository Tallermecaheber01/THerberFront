import api from './axios';

const handleError = (error, functionName) => {
    console.error(
        `Error en ${functionName}:`,
        error.response?.data || error.message
    );
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


export const getAppointmentsWithServices = async (idEmploy) => {
    try {
        const response = await api.get(`/employ/appointments/full/${idEmploy}`);
        return response.data
    } catch (error) {
        return handleError(error, 'getAllAppointmentsWithServices');
    }
};

export const getAllUsersClient = async () => {
    try {
        const response = await api.get('/employ/with-vehicles');
        return response.data
    } catch (error) {
        return handleError(error, 'getAllUsersClient');
    }
}

export const getAllEmployees = async () => {
    try {
        const response = await api.get('/employ/employees');
        return response.data
    } catch (error) {
        return handleError(error, 'getAllEmployees');
    }
}

export const getAllServices = async () => {
    try {
        const response = await api.get('/employ/services');
        return response.data
    } catch (error) {
        return handleError(error, 'getAllServices');
    }
}

export const getAppointmentById = async (appointmentId) => {
    try {
        const response = await api.get(`/employ/appointment/${appointmentId}`);
        return response.data
    } catch (error) {
        return handleError(error,'getAppointmentById');
    }
}

export const getAppointmentsInWaiting = async () => {
    try {
        const response = await api.get(`/employ/appointments/waiting`)
        return response.data;
    } catch (error) {
        return handleError(error,'getAppointmentsInWaiting')
    }
}

// Actualizar una cita en estado "en espera"
export const updateWaitingAppointment = async (appointmentId, data) => {
    try {
        const response = await api.patch(`/employ/appointment/update/${appointmentId}`, data);
        return response.data;
    } catch (error) {
        return handleError(error, 'updateWaitingAppointment');
    }
};

export const getAppointmentsCancelled = async () => {
    try {
        const responde = await api.get(`/employ/appointments/canceled`);
        return responde.data;
    } catch (error) {
        return handleError(error,'getAppointmentsCancelled')
    }
};