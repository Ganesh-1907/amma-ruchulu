import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaSearch, FaRegCreditCard } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    // { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    // { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-yellow-300 shadow-md py-2' : 'bg-yellow-300/80 backdrop-blur-sm py-2'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/images/Logos/MAR.png" 
                  alt="pickles Logo" 
                  className="h-14 w-auto transition-transform duration-300 hover:scale-105"
                />
                <span className="text-xl font-bold text-black ml-3">Ma Amma Ruchulu</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary-600'
                      : 'text-black hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              {location.pathname === '/' && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-black hover:text-primary-600 transition-colors"
              >
                <FaSearch className="w-5 h-5" />
              </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-black hover:text-primary-600 transition-colors"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Link>

              {/* User Menu */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-black hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <FaUser className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 border border-gray-100 hidden md:block"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 mb-1">
                            <p className="font-semibold text-base text-gray-900">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          {/* <Link
                            to="/subscriptions"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors flex items-center gap-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaRegCreditCard className="text-primary-500" />
                            <span>Subscriptions</span>
                          </Link> */}
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2 transition-colors mt-1"
                          >
                            <FaSignOutAlt className="" />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="absolute top-0 left-0 right-0 bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <FaSearch className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden bg-white shadow-lg"
          >
            <div className="p-4">
              {/* Mobile Search */}
              <div className="mb-4 border-b border-gray-100 pb-4">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
                {navLinks
                  .filter(link => link.path === '/about' || link.path === '/contact')
                  .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Menu */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  null
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar; 