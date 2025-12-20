import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'cash',
    deliveryTime: 'morning',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await apiService.get('/cart');
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart');
        toast.error('Failed to load your cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await apiService.post('/orders', {
        ...formData,
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time
                  </label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="morning">Morning (6 AM - 9 AM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{cart.total}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="font-semibold">₹{cart.deliveryCharges}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">₹{cart.total + cart.deliveryCharges}</span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 