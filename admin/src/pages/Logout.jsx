// src/pages/auth/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/Login');
  }, [navigate]);

  return null;
};

export default Logout;
