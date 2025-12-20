import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement review submission logic
    setSubmitted(true);
    setRating(0);
    setReview('');
    setName('');
  };

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Customer",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "The quality of dairy products is exceptional. Fresh milk delivery every morning has made my life so much easier!",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Premium Member",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Great service and amazing product quality. The subscription model is very convenient.",
      rating: 4
    },
    {
      name: "Anita Patel",
      role: "Monthly Subscriber",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "Love the variety of products available. The paneer is absolutely fresh and delicious!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what our customers are saying about our products and services
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                Share Your Experience
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-6 bg-green-50 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Thank you for your review!
                  </h3>
                  <p className="text-green-600">
                    Your feedback helps us improve our services.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <FaStar
                            key={index}
                            className={`text-2xl cursor-pointer ${
                              ratingValue <= (hover || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() => setRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Share your experience with our products and services"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-4xl font-bold text-primary-600 mb-2">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-4xl font-bold text-primary-600 mb-2">1,000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 