import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { user } from '../services/api';
import { toast } from 'react-hot-toast';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await user.getProfile();
      const addressList = response.data.user.addresses || [];
      setAddresses(addressList);
      
      // Set default address as selected if available
      const defaultAddress = addressList.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (addressList.length > 0) {
        setSelectedAddress(addressList[0]);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const selectAddress = (addressId) => {
    const address = addresses.find(addr => addr._id === addressId);
    if (address) {
      setSelectedAddress(address);
    }
  };

  const addAddress = async (addressData) => {
    try {
      setLoading(true);
      const response = await user.addAddress(addressData);
      setAddresses([...addresses, response.data.addresses[response.data.addresses.length - 1]]);
      toast.success('Address added successfully');
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error('Failed to add address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      setLoading(true);
      const response = await user.updateAddress(addressId, addressData);
      setAddresses(addresses.map(addr => 
        addr._id === addressId ? response.data.addresses.find(a => a._id === addressId) : addr
      ));
      toast.success('Address updated successfully');
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error('Failed to update address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);
      await user.deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to delete address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await user.setDefaultAddress(addressId);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      })));
      toast.success('Default address updated successfully');
      return response.data;
    } catch (error) {
      setError(error.message);
      toast.error('Failed to set default address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    addresses,
    selectedAddress,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    fetchAddresses
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

export default AddressContext;