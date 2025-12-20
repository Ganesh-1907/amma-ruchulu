import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Refund Policy</h1>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-12"></div>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Refund Eligibility</h2>
                  <p className="mb-4 text-lg">
                    We want you to be completely satisfied with your purchase. Our refund policy is designed to ensure customer satisfaction while maintaining quality standards.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Products must be returned within 24 hours of delivery</li>
                    <li>Items must be unused and in their original packaging</li>
                    <li>Perishable items are eligible for refund only if quality issues are reported immediately upon delivery</li>
                    <li>Photo evidence may be required for quality-related issues</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Refund Process</h2>
                  <p className="mb-4 text-lg">
                    Once your refund request is approved, we will process it through the following steps:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Initiate refund request through our customer service</li>
                    <li>Quality verification (if applicable)</li>
                    <li>Refund approval</li>
                    <li>Payment processing within 5-7 business days</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Refundable Items</h2>
                  <p className="mb-4 text-lg">
                    The following items are not eligible for refund:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Custom or personalized orders</li>
                    <li>Items damaged due to customer negligence</li>
                    <li>Products past their return window</li>
                    <li>Opened perishable items (unless quality issues are reported immediately)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Methods</h2>
                  <p className="mb-4 text-lg">
                    Refunds will be processed through the original payment method:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Credit/Debit Card: 5-7 business days</li>
                    <li>UPI: 2-3 business days</li>
                    <li>Wallet: 24-48 hours</li>
                    <li>Store Credit: Immediate</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                  <p className="text-lg">
                    If you have any questions about our refund policy, please contact our customer service team:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 mt-4 text-lg">
                    <li>Email: support@akshidairy.com</li>
                    <li>Phone: 1800-123-4567</li>
                    <li>WhatsApp: +91 98765 43210</li>
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

export default RefundPolicy; 