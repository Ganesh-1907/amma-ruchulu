import React, { memo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Subscriptions from './pages/Subscriptions';
import About from './pages/About';
import PrivateRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import Address from './pages/Address';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Add console logs to debug
console.log('App.jsx loaded');

// Create a wrapper component that uses useNavigate
const AppContent = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <ScrollToTop />
      
      {/* Main Layout with Navbar and Footer */}
      <Routes>
        {/* Auth Routes (without Navbar and Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main Routes (with Navbar and Footer) */}
        <Route path="/*" element={
          <>
      <Navbar />
      <main className="flex-grow md:pb-0 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/address" element={<Address />} />
          <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        </Routes>
      </main>
      <BottomNavbar />
      <Footer />
          </>
        } />
      </Routes>
    </div>
  );
});

// Create a wrapper component for context providers
const AppWithProviders = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <AppContent />
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithProviders />
    </Router>
  );
};

export default App; 