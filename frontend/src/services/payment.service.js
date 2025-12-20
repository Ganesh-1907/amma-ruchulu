import api from './api';

const createOrder = async (amount) => {
  try {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const initializeRazorpayPayment = (orderData, onSuccess) => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'RUCHULU',
    description: 'Payment for RUCHULU products',
    order_id: orderData.orderId,
    handler: async (response) => {
      try {
        const verificationData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        };
        
        const verificationResponse = await verifyPayment(verificationData);
        if (onSuccess) {
          onSuccess(verificationResponse);
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
      }
    },
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    theme: {
      color: '#10B981' // Using the primary color from your theme
    }
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};

const paymentService = {
  createOrder,
  verifyPayment,
  initializeRazorpayPayment
};

export default paymentService; 