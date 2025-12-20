import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAddress } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import MapAddressSelector from '../components/MapAddressSelector';
import { toast } from 'react-hot-toast';
import { Loader } from '../components/Loader';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaStar, FaPlus, FaCheck } from 'react-icons/fa';

// Add console logs to debug
console.log('Address component loaded');

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addresses, selectedAddress, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress, selectAddress } = useAddress();
  const { getCartTotal, cart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
    type: 'home'
  });

  useEffect(() => {
    console.log('Address component mounted');
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        selectAddress(defaultAddress._id);
      } else {
        selectAddress(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddress, selectAddress]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMapSelect = (addressData) => {
    setFormData(prev => ({
      ...prev,
      street: addressData.address,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode
    }));
    setShowMap(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        await addAddress(formData);
        toast.success('Address added successfully');
      }
      setShowForm(false);
      setFormData({
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false,
        type: 'home'
      });
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      isDefault: address.isDefault || false,
      type: address.type || 'home'
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully');
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const handlePayNow = () => {
    if (!selectedAddress) {
      toast.error('Please select an address first');
      return;
    }

    const locationState = location.state || {};
    const subscriptionData = locationState.subscriptionData;

    if (subscriptionData) {
      // Handle subscription
      const data = {
        ...subscriptionData,
        deliveryAddress: selectedAddress
      };
      navigate('/payment', { state: { subscriptionData: data } });
    } else {
      // Handle regular order
      const orderData = {
        address: selectedAddress,
        totalAmount: getCartTotal(),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: getCartTotal(),
        total: getCartTotal()
      };
      navigate('/payment', { state: { orderData } });
    }
  };

  if (loading) {
    console.log('Address component is loading');
    return <Loader />;
  }

  console.log('Address component rendering with data:', { addresses, selectedAddress });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Addresses</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your delivery addresses for quick checkout
            </p>
          </div>
          <div className="flex space-x-4">
            {selectedAddress && (
              <button
                onClick={handlePayNow}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaCheck className="mr-2" />
                Proceed to Payment
              </button>
            )}
            <button
              onClick={() => {
                setEditingAddress(null);
                setFormData({
                  street: '',
                  city: '',
                  state: '',
                  pincode: '',
                  landmark: '',
                  isDefault: false,
                  type: 'home'
                });
                setShowForm(true);
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaPlus className="mr-2" />
              Add New Address
            </button>
          </div>
        </div>

        {showMap && (
          <MapAddressSelector
            onAddressSelect={handleMapSelect}
            onClose={() => setShowMap(false)}
          />
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your street address"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Select on Map
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter 6-digit pincode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter nearby landmark"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                selectedAddress?._id === address._id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {address.street}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.landmark && (
                      <p className="text-sm text-gray-500 mt-1">
                        Landmark: {address.landmark}
                      </p>
                    )}
                  </div>
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaStar className="mr-1" />
                      Default
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(address)}
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <FaStar className="mr-1" />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new delivery address.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaPlus className="mr-2" />
                Add New Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address; 