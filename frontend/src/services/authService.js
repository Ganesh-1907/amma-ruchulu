import api from '../api/apiService';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiInstance = api.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiInstance.interceptors.request.use(
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
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          console.error('Access denied');
          break;
        case 404:
          // Not found - show not found message
          console.error('Resource not found');
          break;
        case 500:
          // Server error - show server error message
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Don't store user data or token after registration
      // This ensures the user needs to log in after registration
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiInstance.put('/api/users/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Profile update failed';
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to send reset link';
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Password reset failed';
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await apiInstance.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'OTP verification failed';
    }
  }
};

export default authService; 