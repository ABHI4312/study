import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Memory API
export const memoryAPI = {
  getAll: () => api.get('/memories'),
  getOne: (id) => api.get(`/memories/${id}`),
  create: (data) => api.post('/memories', data),
  update: (id, data) => api.put(`/memories/${id}`, data),
  delete: (id) => api.delete(`/memories/${id}`),
};

// Open When API
export const openWhenAPI = {
  getAll: () => api.get('/openwhen'),
  getOne: (id) => api.get(`/openwhen/${id}`),
  create: (data) => api.post('/openwhen', data),
  open: (id) => api.put(`/openwhen/${id}/open`),
  delete: (id) => api.delete(`/openwhen/${id}`),
};

// Secret Message API
export const secretAPI = {
  getAll: () => api.get('/secrets'),
  getOne: (id) => api.get(`/secrets/${id}`),
  create: (data) => api.post('/secrets', data),
  reveal: (id) => api.put(`/secrets/${id}/reveal`),
  delete: (id) => api.delete(`/secrets/${id}`),
};

// Future Goals API
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  getOne: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  toggle: (id) => api.put(`/goals/${id}/toggle`),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Counter API
export const counterAPI = {
  get: (name) => api.get(`/counter/${name}`),
  increment: (name) => api.post(`/counter/${name}/increment`),
  reset: (name) => api.put(`/counter/${name}/reset`),
};

// Auth API
export const authAPI = {
  verify: (secretCode) => api.post('/auth/verify', { secretCode }),
  setup: (secretCode) => api.post('/auth/setup', { secretCode }),
};

// Surprise Message API
export const surpriseAPI = {
  getAll: () => api.get('/surprises'),
  getUnopenedMessages: () => api.get('/surprises/unopened'),
  getOne: (id) => api.get(`/surprises/${id}`),
  create: (data) => api.post('/surprises', data),
  open: (id) => api.put(`/surprises/${id}/open`),
  delete: (id) => api.delete(`/surprises/${id}`),
};

// Music Settings API
export const musicAPI = {
  get: () => api.get('/music'),
  update: (data) => api.put('/music', data),
  reset: () => api.delete('/music'),
};

export default api;
