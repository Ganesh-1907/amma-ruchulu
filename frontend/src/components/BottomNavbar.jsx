import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaUser, FaHistory } from 'react-icons/fa';

const BottomNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <FaHome size={24} />, label: 'Home' },
    { path: '/products', icon: <FaShoppingBag size={24} />, label: 'Products' },
    { path: '/orders', icon: <FaHistory size={24} />, label: 'Orders' },
    { path: '/profile', icon: <FaUser size={24} />, label: 'Profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path)
                ? 'text-green-600'
                : 'text-gray-600 hover:text-green-500'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar; 