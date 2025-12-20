import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn more about our mission and values
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            {/* Story Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Story</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Founded with a vision to revolutionize the way people access and enjoy their daily essentials,
                    we've grown from a small startup to a trusted name in the industry. Our journey has been
                    driven by innovation, customer satisfaction, and a commitment to quality.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We believe in making life easier for our customers while maintaining the highest standards
                    of service and product quality. Our team works tirelessly to ensure that every interaction
                    with our platform is seamless and enjoyable.
                  </p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-lg overflow-hidden h-64 group"
                >
                  <img
                    src="https://media.istockphoto.com/id/506283829/photo/jars-of-pickled-vegetables-in-the-garden-marinated-food.jpg?s=612x612&w=0&k=20&c=f_JBwYsZer1xUERCMvHnld7yXUxumC1Cm4bupSzFzGQ="
                    alt="Our Story"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Mission, Vision, Values Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-50 p-6 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/7198/7198217.png" 
                    alt="Our Mission" 
                    className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
                <p className="text-gray-600">
                  To provide convenient, reliable, and high-quality services that enhance our customers'
                  daily lives while maintaining sustainable business practices.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-50 p-6 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/7653/7653862.png" 
                    alt="Our Vision" 
                    className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
                <p className="text-gray-600">
                  To become the leading platform for essential services, setting new standards in customer
                  experience and service delivery.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 bg-gray-50 p-6 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/18866/18866935.png" 
                    alt="Our Values" 
                    className="w-6 h-6 transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Our Values</h3>
                <p className="text-gray-600">
                  Integrity, innovation, customer focus, and sustainability are the core values that guide
                  our every decision and action.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 