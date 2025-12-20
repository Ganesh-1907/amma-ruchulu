import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
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
              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Shipping Policy</h1>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-12"></div>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Delivery Areas</h2>
                  <p className="mb-4 text-lg">
                    We currently offer delivery services in select areas to ensure the freshest products reach our customers.
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Major cities and surrounding areas</li>
                    <li>Select tier-2 cities</li>
                    <li>Areas within our cold chain network</li>
                    <li>Check pin code availability on our website</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Delivery Timings</h2>
                  <p className="mb-4 text-lg">
                    We offer flexible delivery slots to accommodate your schedule:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Morning Delivery: 6:00 AM - 8:00 AM</li>
                    <li>Evening Delivery: 4:00 PM - 6:00 PM</li>
                    <li>Express Delivery: Within 2 hours (select areas)</li>
                    <li>Subscription Delivery: As per chosen schedule</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Shipping Charges</h2>
                  <p className="mb-4 text-lg">
                    Our shipping charges are structured as follows:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Free delivery on orders above ₹500</li>
                    <li>Standard delivery charge: ₹40</li>
                    <li>Express delivery charge: ₹80</li>
                    <li>Free delivery for subscription orders</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Order Tracking</h2>
                  <p className="mb-4 text-lg">
                    Track your order through multiple channels:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Track your order through our website</li>
                    <li>SMS updates on order status</li>
                    <li>Email notifications</li>
                    <li>Customer support assistance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Delivery Guidelines</h2>
                  <p className="mb-4 text-lg">
                    To ensure smooth delivery:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-lg">
                    <li>Ensure correct address and contact details</li>
                    <li>Keep an alternate contact number handy</li>
                    <li>Specify delivery instructions if needed</li>
                    <li>Be available during delivery window</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
                  <p className="text-lg">
                    For shipping-related queries, contact our logistics team:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 mt-4 text-lg">
                    <li>Email: delivery@akshidairy.com</li>
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

export default ShippingPolicy; 