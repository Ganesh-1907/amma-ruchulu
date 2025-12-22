import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { products as productsApi } from '../services/api';

const BACKEND_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (img) => {
  if (!img) return '/placeholder.png';
  if (img.startsWith('http')) return img;

  // remove trailing /api if present
  const baseUrl = BACKEND_URL.replace(/\/api\/?$/, '');

  return `${baseUrl}/${img.replace(/^\//, '')}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getById(id);
        setProduct(response.data);
        setQuantity(response.data.minOrder || 1);
      } catch (err) {
        setError('Failed to load product');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (!product) return;
    
    const newValue = parseInt(value);
    if (isNaN(newValue)) {
      setQuantity(product.minOrder || 1);
      return;
    }
    
    const clampedValue = Math.max(product.minOrder || 1, Math.min(product.maxOrder || 100, newValue));
    setQuantity(clampedValue);
  };

  const handleIncrement = () => {
    if (!product) return;
    setQuantity(prev => {
      const newValue = prev + 1;
      return Math.min(newValue, product.maxOrder || 100);
    });
  };

  const handleDecrement = () => {
    if (!product) return;
    setQuantity(prev => {
      const newValue = prev - 1;
      return Math.max(newValue, product.minOrder || 1);
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({
        ...product,
        quantity
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleSubscribe = () => {
    navigate('/subscriptions', { 
      state: { 
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{error || 'Product not found'}</h3>
          <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Thumbnails - Desktop View */}
              <div className="hidden lg:flex flex-col gap-2">
                { (product.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary-500' 
                        : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 max-w-md mx-auto"
                >
                  <img
                    src={getImageUrl((product.images || [])[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      {product.discount}% OFF
                    </div>
                  )}
                </motion.div>

                {/* Thumbnails - Mobile View */}
                <div className="flex lg:hidden gap-2 overflow-x-auto mt-3 pb-2">
                  { (product.images || []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                        selectedImage === index 
                          ? 'ring-2 ring-primary-500' 
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-600">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>
                  <div className="mt-1">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{Math.round(product.price * (1 + product.discount / 100))}
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                          Save ₹{Math.round(product.price * (product.discount / 100))}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Regular Price
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-600">
                  {showFullDescription ? product.description : product.shortDescription}
                  {product.description !== product.shortDescription && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <span className="text-sm text-gray-500">
                    Available: {product.stock} {product.unit}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrement}
                    disabled={!product || quantity <= (product.minOrder || 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product?.minOrder || 1}
                    max={product?.maxOrder || 100}
                    value={quantity || 1}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-16 text-center border-2 border-gray-300 rounded-lg py-1 text-sm"
                  />
                  <button
                    onClick={handleIncrement}
                    disabled={!product || quantity >= (product.maxOrder || 100)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {product.category === 'milk' ? (
                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Subscribe Now</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">Subscription Only</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Product Features</h2>
              <div className="grid grid-cols-2 gap-3">
                { (product.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(product.nutritionInfo || {}).map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500 capitalize">{key}</span>
                    <span className="block text-lg font-semibold text-gray-900 mt-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Plans */}
            {product.subscriptionAvailable && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Subscription Plans</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  { (product.subscriptionPlans || []).map((plan, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary-500 transition-colors duration-200 cursor-pointer">
                      <span className="block text-lg font-medium text-gray-900">{plan.duration}</span>
                      <span className="block text-sm text-primary-600 mt-1">Save {plan.discount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 