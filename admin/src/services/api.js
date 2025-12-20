import axios from 'axios';
import Dashboard from '../../../frontend/src/pages/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const adminApi = {
  // Auth
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
    getProfile: () => api.get('/api/users/profile'),
    forgotPassword: (email) => api.post('/api/auth/forgot-password' , {email})
  },

  // Users
  users: {
    getAll: () => api.get('/api/users'),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (data) => api.post('/api/users', data),
    update: (id, data) => api.put(`/api/users/${id}`, data),
    updateStatus: (id, isActive) => api.put(`/api/users/${id}/status`, { isActive }),
    delete: (id) => api.delete(`/api/users/${id}`)
  },

  // Products
  products: {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (formData) => {
      const token = localStorage.getItem('adminToken');
      return api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    update: (id, formData) => {
      const token = localStorage.getItem('adminToken');
      return api.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    delete: (id) => api.delete(`/api/products/${id}`),
  },

  // Orders
  orders: {
    getAll: () => api.get('/api/orders/admin/all'),
    getById: (id) => api.get(`/api/orders/admin/${id}`),
    updateStatus: (id, status) => api.put(`/api/orders/admin/status/${id}`, { status }),
  },

  // Subscriptions
  subscriptions: {
    getAll: () => api.get('/api/subscriptions'),
    getById: (id) => api.get(`/api/subscriptions/${id}`),
    updateStatus: (id, status) => api.put(`/api/subscriptions/${id}/status`, { status }),
    cancel: (id) => api.post(`/api/subscriptions/${id}/cancel`),
    pause: (id) => api.post(`/api/subscriptions/${id}/pause`),
    resume: (id) => api.post(`/api/subscriptions/${id}/resume`),
  },

Dashboard:{
  getAll:() =>api.get('/api/dashboard/stats'),

},

};

export default adminApi; 