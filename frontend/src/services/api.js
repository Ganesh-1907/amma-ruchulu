import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const auth = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return { token, user: user ? JSON.parse(user) : null };
  }
};

// User API calls
export const user = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  // Address management
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/users/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.put(`/users/addresses/${addressId}/default`)
};

// Product API calls
export const products = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${encodeURIComponent(category)}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Order API calls
export const orders = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getDriverOrders: () => api.get('/orders/driver'),
  verifyOTP: (orderId, otp) => api.post('/orders/verify-otp', { orderId, otp }),
  updateDeliveryStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status })
};

// Subscription API calls
export const subscriptions = {
  getAll: () => api.get('/subscriptions'),
  getById: (id) => api.get(`/subscriptions/${id}`),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  cancel: (id) => api.patch(`/subscriptions/${id}/cancel`),
  pause: (id) => api.patch(`/subscriptions/${id}/pause`),
  resume: (id) => api.patch(`/subscriptions/${id}/resume`),
  generateOTP: (id) => api.post(`/subscriptions/${id}/generate-otp`)
};

// Payment API calls
export const payments = {
  createOrder: (orderData) => api.post('/payment/create-order', orderData),
  verifyPayment: (paymentData) => api.post('/payment/verify-payment', paymentData),
};

// Test Email API calls
export const testEmail = {
  testEmail: () => api.post('/test/test-email')
};

export default api; 