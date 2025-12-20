import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OTPVerification = ({ orderId, onVerificationComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  // Generate a random 6-digit OTP
  useEffect(() => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    
    // Simulate sending OTP via SMS and WhatsApp
    toast.success(`OTP sent to your mobile number and WhatsApp: ${newOTP}`);
    
    // Start timer
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
    }
  };

  const handleResendOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    toast.success(`New OTP sent: ${newOTP}`);
  };

  const handleVerify = () => {
    setLoading(true);
    const enteredOTP = otp.join('');
    
    // Simulate verification
    setTimeout(() => {
      if (enteredOTP === generatedOTP) {
        toast.success('OTP verified successfully!');
        onVerificationComplete(orderId);
      } else {
        toast.error('Invalid OTP. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Order</h2>
        <p className="text-gray-600 mt-2">
          Please enter the 6-digit OTP sent to your mobile number and WhatsApp
        </p>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            maxLength={1}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleVerify}
          disabled={loading || otp.some(digit => !digit)}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            loading || otp.some(digit => !digit) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={timer > 0}
          className={`w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            timer > 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </button>
      </div>
    </motion.div>
  );
};

export default OTPVerification; 