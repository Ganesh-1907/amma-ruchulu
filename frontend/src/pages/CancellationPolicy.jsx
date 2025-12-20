import React from 'react';
import { motion } from 'framer-motion';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-8 py-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Cancellation Policy</h1>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-12"></div>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Cancellation Policy</h2>
                  <p className="mb-4 text-lg">
                    Please note our important cancellation policy:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Orders cannot be cancelled once placed</li>
                    <li>Please review your order carefully before confirming</li>
                    <li>All orders are final and non-refundable</li>
                    <li>We recommend double-checking your order details before proceeding to payment</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Subscription Cancellation</h2>
                  <p className="mb-4 text-lg">
                    For subscription cancellations:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Cancel anytime through our website</li>
                    <li>Pause subscription instead of cancelling if temporary</li>
                    <li>No refunds for cancelled subscriptions</li>
                    <li>Cancellation confirmation will be sent via email</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Contact Information</h2>
                  <p className="text-lg">
                    For any queries regarding our cancellation policy, contact our support team:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 mt-4 text-lg">
                    <li>Email: maammaruchulu@gmail.com</li>
                    <li>Phone: +91 970-155-5435</li>
                    <li>WhatsApp: +91 970-155-5435</li>
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy; 