import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            <motion.button
              onClick={handleAddToCart}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                isHovered
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard; 