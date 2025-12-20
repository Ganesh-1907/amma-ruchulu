import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import { motion } from 'framer-motion';
import { FaCopy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { orders as ordersApi } from '../services/api';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Helper function to get image URL (robust)
const getImageUrl = (product) => {
  const img = product?.image || (Array.isArray(product?.images) && product.images[0]);
  if (!img) return PLACEHOLDER_IMAGE;
  return img.startsWith('http') ? img : BACKEND_URL + img.replace(/^\/+/, '');
};

const Loader = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200`}>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" 
               style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

const statusStyles = {
  delivered: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-yellow-100 text-yellow-800',
  'out for delivery': 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({ type: null, orderId: null });
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    // { value: 'preparing', label: 'Preparing' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Note: Cancelled orders are non-refundable.')) {
      try {
        setActionLoading({ type: 'cancel', orderId });
        await ordersApi.cancel(orderId);
        await fetchOrders(); // Refresh orders after cancellation
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error('Failed to cancel order. Please try again.');
      } finally {
        setActionLoading({ type: null, orderId: null });
      }
    }
  };

  const handleTrackOrder = async (order) => {
    try {
      setTrackingLoading(true);
      const response = await ordersApi.getTracking(order._id);
      setSelectedOrder({ ...order, trackingDetails: response.data.trackingDetails });
      setIsTrackingModalOpen(true);
    } catch (err) {
      toast.error('Failed to fetch tracking details');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      setActionLoading({ type: 'download', orderId: order._id });
      const response = await ordersApi.getInvoice(order._id, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      toast.error('Failed to download invoice');
    } finally {
      setActionLoading({ type: null, orderId: null });
    }
  };

  const filteredOrders = orders
    .filter(order => selectedFilter === 'all' || order.status?.toLowerCase() === selectedFilter)
    .filter(order => 
      searchQuery === '' || 
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items && order.items.some(item => item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {location.state?.otp && (
          <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
            <p className="font-semibold">Delivery OTP: {location.state.otp}</p>
            <p className="text-sm mt-2">Please keep this OTP handy for delivery verification.</p>
          </div>
        )}

        {location.state?.userDetails && location.state?.orderSummary && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6">
            <h2 className="font-semibold text-xl mb-2">Payment Details & Order Summary</h2>
            <div className="mb-3">
              <p><span className="font-medium">Name:</span> {location.state.userDetails.name}</p>
              <p><span className="font-medium">Email:</span> {location.state.userDetails.email}</p>
              {location.state.userDetails.phone && <p><span className="font-medium">Phone:</span> {location.state.userDetails.phone}</p>}
            </div>
            <h3 className="font-medium text-lg mb-2">Ordered Items:</h3>
            <ul className="list-disc list-inside mb-3">
              {location.state.orderSummary.items.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} x {item.quantity} - ₹{item.price}
                </li>
              ))}
            </ul>
            <p className="font-semibold text-lg">Total Amount: ₹{location.state.orderSummary.totalAmount}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-6)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span>{item.product?.name} x {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Total Amount</span>
                      <span className="text-lg font-semibold text-gray-900">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Details</h3>
                    <div className="text-sm text-gray-500">
                      <p>Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                      <p>Time: {order.deliveryTime}</p>
                      {order.address && (
                        <p className="mt-2">
                          {order.address.street}<br />
                          {order.address.city}, {order.address.state}<br />
                          Pincode: {order.address.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.status === 'out_for_delivery' && order.otp && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-gray-500">
                        Delivery OTP: <span className="font-semibold">{order.otp}</span>
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end space-x-4">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={actionLoading.type === 'cancel' && actionLoading.orderId === order._id}
                        className="px-4 py-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {actionLoading.type === 'cancel' && actionLoading.orderId === order._id
                          ? 'Cancelling...'
                          : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const statusSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' }
];

function SimpleModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}

const copyToClipboard = (otp) => {
  navigator.clipboard.writeText(otp);
  toast.success('OTP copied to clipboard!');
};

export default Orders; 