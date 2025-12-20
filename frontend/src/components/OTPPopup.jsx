import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const OTPPopup = ({ otp, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp);
    toast.success('OTP copied to clipboard!');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery OTP</h2>
            <p className="text-gray-600">
              Please provide this OTP to the delivery partner when they arrive
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-mono font-bold tracking-wider text-primary-600">
                {otp}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Copy OTP"
              >
                <FaCopy size={20} />
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ Please keep this OTP handy for delivery verification.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Got it
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OTPPopup; 