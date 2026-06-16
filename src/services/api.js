import axios from 'axios';

// Instance partagée avec un timeout augmenté pour les opérations réseaux
export const api = axios.create({
  baseURL: 'https://trustid-backend-049u.onrender.com',
  timeout: 20000, 
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Intercepteur pour capturer et logger les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API Globale :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fonctions exportées
export const getProfilPublic = (userId) => api.get(`/api/auth/profil/${userId}`).then(r => r.data);
export const rechercherParEmail = (email) => api.get(`/api/auth/recherche`, { params: { email } }).then(r => r.data);
export const verifierSignature = (signatureId) => api.get(`/api/sign/verifier/${signatureId}`).then(r => r.data);
export const getHistorique = (userId, page) => api.get(`/api/sign/historique/${userId}`, { params: { page, limite: 10 } }).then(r => r.data);
export const getAlertes = (userId) => api.get(`/api/sign/alertes/${userId}`).then(r => r.data);
export const healthCheck = () => api.get('/health').then(r => r.data);

// Fonction cruciale pour l'envoi de signature
export const envoyerSignature = (data) => api.post('/api/sign/create', data).then(r => r.data);