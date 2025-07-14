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

export const getClientById = async (id) => {
    try {
        const response = await api.get(`/employ/clients/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error, 'getClientById');
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
        return handleError(error, 'getAppointmentById');
    }
}

export const getAppointmentsWithServicesID = async (employeeId) => {
    try {
        const url = employeeId
            ? `/employ/appointments/full/${employeeId}`
            : `/employ/appointments/full`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error en getAppointmentsWithServicesID:", error);
        return null;
    }
};


export const getAppointmentsInWaiting = async () => {
    try {
        const response = await api.get('/employ/appointments/waiting')
        return response.data;
    } catch (error) {
        return handleError(error, 'getAppointmentsInWaiting')
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
        return handleError(error, 'getAppointmentsCancelled')
    }
};

export const createRepair = async (repairData) => {
    try {
        const response = await api.post('/employ/repairs', repairData);
        return response.data;
    } catch (error) {
        return handleError(error, 'createRepair');
    }

};

// Función para obtener todas las reparaciones
export const getAllRepairs = async () => {
    try {
        const response = await api.get('/employ/repairs');
        return response.data;
    } catch (error) {
        return handleError(error, 'getAllRepairs');
    }
};

export const getRepairById = async (repairId) => {
    try {
        const response = await api.get(`/employ/repairs/${repairId}`);
        return response.data;
    } catch (error) {
        return handleError(error, 'getRepairById');
    }
};

export const updateRepair = async (repairId, updateRepairDto) => {
    try {
        const response = await api.patch(`/employ/repairs/${repairId}`, updateRepairDto);
        return response.data;
    } catch (error) {
        return handleError(error, 'updateRepair');
    }
};


export const rejectAppointment = async (data) => {
    try {
        const response = await api.post('/employ/appointment/reject', data);
        return response.data;
    } catch (error) {
        return handleError(error, 'rejectAppointment')
    }
}

export const getAppointmentsPendingChange = async () => {
    try {
        const response = await api.get('/employ/appointments/pending-change');
        return response.data;
    } catch (error) {
        return handleError(error, 'getAppointmentsPendingChange');
    }
};


