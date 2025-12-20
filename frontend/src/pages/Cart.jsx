import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { FaTrash, FaPlus, FaMinus, FaMapMarkerAlt, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Loader } from '../components/Loader';
import { BACKEND_URL } from '../config';

const getImageUrl = (img) => {
  if (!img) return '/placeholder.png';
  return img.startsWith('http') ? img : BACKEND_URL + img.replace(/^\/+/, '');
};

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError, initialized, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addresses, selectedAddress, loading: addressLoading, selectAddress } = useAddress();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when cart changes
  useEffect(() => {
    if (!cartLoading) {
      setIsLoading(false);
    }
  }, [cartLoading]);

  // Calculate cart totals with null checks
  const subtotal = cart?.reduce((total, item) => {
    if (!item || !item.product?.price || !item.quantity) return total;
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const total = subtotal;

  // Get available delivery dates (next 7 days)
  const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) { // Start from 0 to include today
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  // Available delivery time slots
  const timeSlots = [
    { value: '06:00-08:00', label: '6 AM - 8 AM' },
    { value: '08:00-10:00', label: '8 AM - 10 AM' },
    { value: '16:00-18:00', label: '4 PM - 6 PM' },
    { value: '18:00-20:00', label: '6 PM - 8 PM' }
  ];

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      setIsLoading(true);
      const item = cart?.find(item => item._id === itemId);
      if (!item) {
        toast.error('Item not found in cart');
        return;
      }

      // Validate quantity against min and max order limits
      const minOrder = item.product?.minOrder || 1;
      const maxOrder = item.product?.maxOrder || 100;

      if (newQuantity < minOrder) {
        toast.error(`Minimum order quantity is ${minOrder}`);
        return;
      }

      if (newQuantity > maxOrder) {
        toast.error(`Maximum order quantity is ${maxOrder}`);
        return;
      }

      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setIsLoading(true);
      const item = cart.find(item => item._id === itemId);
      if (!item) {
        toast.error('Item not found in cart');
        return;
      }
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setIsLoading(true);
        await clearCart();
        toast.success('Cart cleared successfully');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!selectedDeliveryDate || !selectedTimeSlot) {
      toast.error('Please select delivery date and time');
      return;
    }

    const orderData = {
      items: cart || [],
      subtotal,
      total,
      address: selectedAddress,
      deliveryDate: selectedDeliveryDate,
      deliveryTime: selectedTimeSlot
    };
    console.log("the data that fronetend sending", orderData)

    navigate('/payment', { state: { orderData } });
  };

  if (!initialized || cartLoading || addressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{cartError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
              <div className="text-sm text-gray-500 mb-2">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {(() => { const d = new Date(); return d.toLocaleDateString('en-GB'); })()}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <FaShoppingBag className="h-24 w-24 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <div className="text-sm text-gray-500 mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {(() => { const d = new Date(); return d.toLocaleDateString('en-GB'); })()}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item._id} className="p-6 flex items-center gap-6">
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={getImageUrl(item?.product?.images?.[0])}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-medium text-gray-900 truncate flex-1">{item?.product?.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-medium text-gray-900">₹{item?.product?.price * item.quantity}</p>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isLoading}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove item"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">₹{item?.product?.price} per {item?.product?.unit || 'item'}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={isLoading || item.quantity <= (item.product?.minOrder || 1)}
                            className="text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-primary-200 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <FaMinus />
                          </button>
                          <span className="mx-2 text-gray-900 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= (item.product?.maxOrder || 100)}
                            className="text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-primary-200 rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleClearCart}
                disabled={isLoading}
                className="mt-6 flex items-center px-4 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
              >
                <FaTrash className="mr-2" />
                Clear Cart
              </button>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h3>
                  {addresses && addresses.length > 0 ? (
                    <div className="space-y-2">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => selectAddress(address)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors duration-200 ${selectedAddress?._id === address._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-500'}`}
                        >
                          <div className="flex items-start">
                            <FaMapMarkerAlt className="text-primary-500 mt-1 mr-2" />
                            <div>
                              <p className="text-sm text-gray-900">{address.street}</p>
                              <p className="text-sm text-gray-500">{address.city}, {address.state} {address.pincode}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => navigate('/address')}
                        className="w-full text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        + Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-2">No addresses found</p>
                      <button
                        onClick={() => navigate('/address')}
                        className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
                {/* Delivery Date & Time */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <select
                      value={selectedDeliveryDate}
                      onChange={(e) => setSelectedDeliveryDate(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a date</option>
                      {getDeliveryDates().map((date) => (
                        <option key={date.value} value={date.value}>{date.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Order Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="text-primary-600">₹{total}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || !selectedAddress || !selectedDeliveryDate || !selectedTimeSlot}
                  className="mt-6 w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 