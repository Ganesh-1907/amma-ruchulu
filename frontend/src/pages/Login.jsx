import React, { useState, useCallback, useEffect, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';

// Add console logs to debug
console.log('Login.jsx loaded');

const Login = memo(() => {
  // Log only on mount
  useEffect(() => {
    console.log('Login component mounted');
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Always declare all hooks at the top level
  const validateForm = useCallback(() => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    return true;
  }, [formData.email, formData.password]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const togglePasswordVisibility = useCallback((e) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('Attempting login with:', { email: formData.email });

    try {
      const response = await login({...formData, loginType: "user"});
      console.log('Login response:', response);
      
      if (response?.user) {
        toast.success('Login successful!');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        console.error('Login response missing user data:', response);
        toast.error('Login failed. Invalid response from server.');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      toast.error(error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }, [formData, login, navigate, location, validateForm]);

  const handleSocialLogin = useCallback((e, provider) => {
    e.preventDefault();
    console.log(`${provider} login clicked`);
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Render loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const socialLogins = [
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      hoverBg: 'hover:bg-gray-50',
    },
    // {
    //   name: 'Apple',
    //   icon: (
    //     <svg className="w-5 h-5" viewBox="0 0 24 24">
    //       <path
    //         fill="currentColor"
    //         d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.53-3.2 0-1.39.68-2.12.53-3.02-.4C3.7 16.12 4.24 9.5 8.96 9.15c1.37.05 2.37.88 3.36.91 1.13-.19 2.21-1.01 3.5-.91 1.58.13 2.78.73 3.54 1.84-3.2 1.98-2.69 5.85.69 7.29zm-3.27-13.5c.18-1.89-1.31-3.48-3.02-3.78-1.59 1.37-1.47 3.52.35 4.22 1.43.87 2.33-.04 2.67-.44z"
    //       />
    //     </svg>
    //   ),
    //   bgColor: 'bg-black',
    //   textColor: 'text-white',
    //   borderColor: 'border-black',
    //   hoverBg: 'hover:bg-gray-900',
    // },
  ];

  // Render login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Logo and Title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* <img
              className="mx-auto h-16 w-auto"
              src="/images/logo.png"
              alt=""
            /> */}
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                  placeholder="Enter your password (min 8 characters)"
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 mt-1 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </motion.form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {socialLogins.map((social) => (
            <button
              key={social.name}
              type="button"
              onClick={(e) => handleSocialLogin(e, social.name)}
              className={`relative w-full flex justify-center py-3 px-4 border ${social.borderColor} rounded-md shadow-sm ${social.bgColor} ${social.textColor} text-sm font-medium ${social.hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {social.icon}
              </span>
              Continue with {social.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

Login.displayName = 'Login';
export default Login; 