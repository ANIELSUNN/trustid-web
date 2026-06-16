import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://trustid-backend-049u.onrender.com',
  timeout: 20000, // Augmenté à 20 secondes pour les opérations de signature
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Intercepteur pour capturer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cela permettra de voir l'erreur dans la console même si le code oublie de le faire
    console.error("Erreur API Globale :", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Ajout de la fonction pour envoyer la signature
export const envoyerSignature = (data) => api.post('/api/sign/create', data).then(r => r.data);