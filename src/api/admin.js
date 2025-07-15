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
        return response.data;
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

export const updateCorporateImage = async (corporateImageId, corporateImageData) => {
  try {
    const response = await api.patch(
      `/admin/updatecorporateimage/${corporateImageId}`,
      corporateImageData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'updateCorporateImage');
  }
};

export const createContact = async (contactData) => {
  try {
    const response = await api.post('/admin/newcontact', contactData);
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    return handleError(error, 'createContact');
  }
};


export const updateContact = async (contactId, contactData) => {
  try {
    const response = await api.patch(
      `/admin/updatecontact/${contactId}`,
      contactData
    );
    return response.data;
  } catch (error) {
    return handleError(error, 'updateContact');
  }
};


export const getAllContacts = async () => {
  try {
    const response = await api.get('/admin/all-contacts');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllContacts');
  }
};

export const getContactById = async (id) => {
  try {
    const response = await api.get(`/admin/contact/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getContactById');
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await api.delete(`/admin/deletecontact/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'deleteContact');
  }
};

export const getCorporateImageById = async (id) => {
  try {
    const response = await api.get(`/admin/corporateimage/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getCorporateImageById');
  }
};

export const getAllCorporateImages = async () => {
  try {
    const response = await api.get('/admin/allcorporateimages');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllCorporateImages');
  }
};

export const createPolice = async (policeData) => {
  try {
    const response = await api.post('/admin/new-police', policeData);
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    return handleError(error, 'createPolice');
  }
};

export const updatePolice = async (policeId, policeData) => {
  try {
    const response = await api.patch(`/admin/update-police/${policeId}`, policeData);
    return response.data;
  } catch (error) {
    return handleError(error, 'updatePolice');
  }
};

export const updatePoliceStatus = async (policeId) => {
  try {
    const response = await api.patch(`/admin/update-status/${policeId}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'updatePoliceStatus');
  }
};


export const getAllPolices = async () => {
  try {
    const response = await api.get('/admin/all-polices');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllPolices');
  }
};

export const getPoliceById = async (id) => {
  try {
    const response = await api.get(`/admin/police/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getPoliceById');
  }
};

export const deletePolice = async (id) => {
  try {
    const response = await api.delete(`/admin/delete-police/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'deletePolice');
  }
};

// Demarcations
export const getAllDemarcations = async () => {
  try {
    const response = await api.get('/admin/demarcations');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllDemarcations');
  }
};

export const updateDemarcation = async (id, data) => {
  try {
    const response = await api.patch(`/admin/demarcations/${id}`, data);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateDemarcation');
  }
};

// Security Policies
export const getAllSecurityPolicies = async () => {
  try {
    const response = await api.get('/admin/security-policies');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllSecurityPolicies');
  }
};

export const updateSecurityPolicy = async (id, data) => {
  try {
    const response = await api.patch(`/admin/security-policies/${id}`, data);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateSecurityPolicy');
  }
};

// Terms
export const getAllTerms = async () => {
  try {
    const response = await api.get('/admin/terms');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllTerms');
  }
};

export const updateTerms = async (id, data) => {
  try {
    const response = await api.patch(`/admin/terms/${id}`, data);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateTerms');
  }
};

// FAQ

export const createFaq = async (faqData) => {
  try {
    const response = await api.post('/admin/new-faq', faqData);
    return response.data;
  } catch (error) {
    return handleError(error, 'createFaq');
  }
};

export const getAllFaqs = async () => {
  try {
    const response = await api.get('/admin/all-faqs');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllFaqs');
  }
};

export const getFaqById = async (id) => {
  try {
    const response = await api.get(`/admin/faq/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getFaqById');
  }
};

export const updateFaq = async (faqData) => {
  try {
    const response = await api.patch('/admin/update-faq', faqData);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateFaq');
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await api.delete(`/admin/delete-faq/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'deleteFaq');
  }
};

// Buscar FAQs parcialmente
export const searchFaqs = async (query) => {
  try {
    const response = await api.get(`/admin/faq/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'searchFaqs');
  }
};

// Buscar FAQ por pregunta exacta
export const findFaqByPregunta = async (pregunta) => {
  try {
    const response = await api.get(`/admin/faq/exact?pregunta=${encodeURIComponent(pregunta)}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'findFaqByPregunta');
  }
};

// --- Quiz Questions ---
export const createQuizQuestion = async (quizData) => {
  try {
    const response = await api.post('/admin/quiz/new-question', quizData);
    return response.data;
  } catch (error) {
    return handleError(error, 'createQuizQuestion');
  }
};

export const getAllQuizQuestions = async () => {
  try {
    const response = await api.get('/admin/quiz/questions');
    return response.data;
  } catch (error) {
    return handleError(error, 'getAllQuizQuestions');
  }
};

export const getQuizQuestionById = async (id) => {
  try {
    const response = await api.get(`/admin/quiz/question/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, 'getQuizQuestionById');
  }
};

export const updateQuizQuestion = async (quizData) => {
  try {
    const response = await api.patch('/admin/quiz/update-question', quizData);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateQuizQuestion');
  }
};

export const deleteQuizQuestion = async (deleteDto) => {
  try {
    const response = await api.delete('/admin/quiz/delete-question', { data: deleteDto });
    return response.data;
  } catch (error) {
    return handleError(error, 'deleteQuizQuestion');
  }
};

// --- Quiz Contact ---
export const updateQuizContact = async (contactData) => {
  try {
    const response = await api.patch('/admin/quiz/contact', contactData);
    return response.data;
  } catch (error) {
    return handleError(error, 'updateQuizContact');
  }
};

export const getQuizContact = async () => {
  try {
    const response = await api.get('/admin/quiz/contacts');
    return response.data;
  } catch (error) {
    return handleError(error, 'getQuizContact');
  }
};
