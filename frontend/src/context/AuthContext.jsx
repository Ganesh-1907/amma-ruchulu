import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// Add console logs to debug
console.log('AuthContext.jsx loaded');

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
      setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authService.register(userData);
      // Don't set user state after registration
      // This ensures the user needs to log in after registration
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
    authService.logout();
    setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const data = await authService.updateProfile(userData);
      setUser(data);
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      toast.error(error || 'Failed to send reset instructions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const data = await authService.resetPassword(token, newPassword);
      return data;
    } catch (error) {
      toast.error(error || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      const data = await authService.verifyOTP(email, otp);
      toast.success('OTP verified successfully');
      return data;
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyOTP,
    isAuthenticated: !!user
  }), [user, loading, initialized]);

  // Show loading state while initializing
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 