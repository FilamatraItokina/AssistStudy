// Helper pour les appels API avec authentification
// En production, utilise la variable d'environnement VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur API');
  }

  return response.json();
};

export const api = {
  get: (url) => apiCall(url),
  post: (url, data) => apiCall(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => apiCall(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => apiCall(url, { method: 'DELETE' })
};
