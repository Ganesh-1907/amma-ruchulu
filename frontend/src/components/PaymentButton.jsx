import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import paymentService from '../services/payment.service';

const PaymentButton = ({ amount, onSuccess, buttonText = 'Pay Now', className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const orderData = await paymentService.createOrder(amount);
      
      paymentService.initializeRazorpayPayment(orderData, (response) => {
        toast.success('Payment successful!');
        if (onSuccess) {
          onSuccess(response);
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
};

export default PaymentButton; 