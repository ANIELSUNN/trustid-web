import axios from 'axios';

// Instance partagée pour vos appels
export const api = axios.create({
  baseURL: 'http://localhost:5000', // Ou votre URL Render
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Vos fonctions existantes restent ici
export const getProfilPublic = (userId) => api.get(`/api/auth/profil/${userId}`).then(r => r.data);
export const rechercherParEmail = (email) => api.get(`/api/auth/recherche`, { params: { email } }).then(r => r.data);
export const verifierSignature = (signatureId) => api.get(`/api/sign/verifier/${signatureId}`).then(r => r.data);
export const getHistorique = (userId, page) => api.get(`/api/sign/historique/${userId}`, { params: { page, limite: 10 } }).then(r => r.data);
export const getAlertes = (userId) => api.get(`/api/sign/alertes/${userId}`).then(r => r.data);
export const healthCheck = () => api.get('/health').then(r => r.data);