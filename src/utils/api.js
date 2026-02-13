import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Brother APIs
export const brotherAPI = {
  getAll: (type) => api.get('/brothers', { params: { type } }),
  create: (brotherData) => api.post('/brothers', brotherData),
  update: (id, brotherData) => api.put(`/brothers/${id}`, brotherData),
  delete: (id) => api.delete(`/brothers/${id}`)
};

// One-on-One APIs
export const oneOnOneAPI = {
  getAll: (type) => api.get('/one-on-ones', { params: { type } }),
  getStats: () => api.get('/one-on-ones/stats'),
  create: (oneOnOneData) => api.post('/one-on-ones', oneOnOneData),
  update: (id, oneOnOneData) => api.put(`/one-on-ones/${id}`, oneOnOneData),
  delete: (id) => api.delete(`/one-on-ones/${id}`)
};

// Weekly Requirements APIs
export const weeklyRequirementsAPI = {
  getAll: () => api.get('/weekly-requirements'),
  getCurrent: () => api.get('/weekly-requirements/current'),
  create: (requirementData) => api.post('/weekly-requirements', requirementData),
  update: (id, requirementData) => api.put(`/weekly-requirements/${id}`, requirementData),
  delete: (id) => api.delete(`/weekly-requirements/${id}`)
};

// Paddle Task APIs
export const paddleTaskAPI = {
  getAll: () => api.get('/paddle-tasks'),
  getByWeek: (date) => api.get(`/paddle-tasks/week/${date}`),
  createOrUpdate: (paddleTaskData) => api.post('/paddle-tasks', paddleTaskData),
  update: (id, paddleTaskData) => api.put(`/paddle-tasks/${id}`, paddleTaskData)
};

// Todo APIs
export const todoAPI = {
  getAll: (params) => api.get('/todos', { params }),
  getAllForAdmin: (params) => api.get('/todos/all', { params }),
  getStats: () => api.get('/todos/stats'),
  create: (todoData) => api.post('/todos', todoData),
  createBulk: (todoData) => api.post('/todos/bulk', todoData),
  update: (id, todoData) => api.put(`/todos/${id}`, todoData),
  delete: (id) => api.delete(`/todos/${id}`)
};

// Feedback APIs
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  getByMilestone: (milestone) => api.get(`/feedback/milestone/${milestone}`),
  getAllForAdmin: (params) => api.get('/feedback/all', { params }),
  getPledges: () => api.get('/feedback/pledges'),
  create: (feedbackData) => api.post('/feedback', feedbackData),
  update: (id, feedbackData) => api.put(`/feedback/${id}`, feedbackData),
  delete: (id) => api.delete(`/feedback/${id}`)
};

export default api;

