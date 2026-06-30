import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://trustid-backend-production.up.railway.app';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Accept': 'application/json'
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API Globale :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const healthCheck = () => api.get('/health').then(r => r.data);
export const getProfilPublic = (userId) => api.get(`/api/auth/profil/${userId}`).then(r => r.data);
export const rechercherParEmail = (email) => api.get(`/api/auth/recherche`, { params: { email } }).then(r => r.data);
export const verifierSignature = (signatureId) => api.get(`/api/sign/verifier/${signatureId}`).then(r => r.data);
export const getHistorique = (userId, page) => api.get(`/api/sign/historique/${userId}`, { params: { page, limite: 10 } }).then(r => r.data);
export const getAlertes = (userId) => api.get(`/api/sign/alertes/${userId}`).then(r => r.data);
export const envoyerSignature = (data) => api.post('/api/sign/create', data).then(r => r.data);

// Upload multipart/form-data
export const uploadDocument = (formData) => {
  return api.post('/api/multisign/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  }).then(r => r.data);
};
