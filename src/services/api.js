// ============================================================
//  TrustID — Dashboard Web — services/api.js
// ============================================================

import axios from 'axios';

// Même IP que le backend — adaptez selon votre config
const BASE_URL = 'https://trustid-backend-l5pj.onrender.com';
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// AUTH
export const getProfilPublic    = (userId)      => api.get(`/api/auth/profil/${userId}`).then(r => r.data);
export const rechercherParEmail = (email)        => api.get(`/api/auth/recherche`, { params: { email } }).then(r => r.data);

// SIGNATURES
export const verifierSignature  = (signatureId)  => api.get(`/api/sign/verifier/${signatureId}`).then(r => r.data);
export const getHistorique      = (userId, page) => api.get(`/api/sign/historique/${userId}`, { params: { page, limite: 10 } }).then(r => r.data);
export const getAlertes         = (userId)        => api.get(`/api/sign/alertes/${userId}`).then(r => r.data);

// SANTÉ
export const healthCheck        = ()              => api.get('/health').then(r => r.data);
