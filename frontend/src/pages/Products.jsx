import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { products as productsApi } from '../services/api';
import { mockProducts } from '../data/mockProducts';

const BACKEND_URL = import.meta.env.VITE_API_URL;

// Helper function to get image URL
const getImageUrl = (img) => {
  if (!img) return '/placeholder.png';
  if (img.startsWith('http')) return img;
  // Ensure the path always starts with a slash before combining with BACKEND_URL
  const cleanImgPath = img.startsWith('/') ? img : `/${img}`;
  return BACKEND_URL + cleanImgPath.replace(/^\/+/, '');
};

// Image Modal Component
const ImageModal = ({ isOpen, onClose, product, quantities, handleQuantityChange, handleAddToCart, categories }) => {
  if (!isOpen) return null;

  const categoryDescription = categories.find(cat => cat.id === product?.category)?.description || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-[280px] md:max-w-4xl w-full mx-auto" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-1 md:gap-4 p-1.5 md:p-4">
            {/* Image Section */}
            <div className="relative">
              <img
                src={product?.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder.png'}
                alt={product?.name}
                className="w-full h-auto max-h-[35vh] md:max-h-[60vh] object-contain rounded-lg"
              />
              {product?.discount > 0 && (
                <div className="absolute top-0.5 right-0.5 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[9px] md:text-sm font-medium">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-base md:text-2xl font-semibold text-gray-800 mb-0.5 md:mb-2 bg-yellow-200 inline-block">{product?.name}</h2>
                {/* Sales Information (Placeholder) */}
                
                {/* Limited Time Deal (Placeholder) */}
                {product?.discount > 0 && (
                  <span className="inline-block bg-red-600 text-white text-[8px] md:text-xs font-semibold px-1.5 py-0.5 rounded-full mb-1.5 md:mb-4">
                    Limited time deal
                  </span>
                )}

                <p className="text-[10px] md:text-gray-600 mb-1.5 md:mb-4">{categoryDescription}</p>
                
                {/* Product Tags */}
                {product?.tags && product.tags.length > 0 && (
                  <div className="mb-1.5 md:mb-4">
                    <h4 className="text-[10px] md:text-sm font-medium text-gray-700 mb-0.5">Tags:</h4>
                    <div className="flex flex-wrap gap-0.5 md:gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-[9px] md:text-xs px-1 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price Section */}
                <div className="mb-1.5 md:mb-4">
                  <div className="flex items-baseline gap-0.5 md:gap-2">
                    <span className="text-lg md:text-3xl font-bold text-gray-900">₹{product?.price}</span>
                    {product?.discount > 0 && (
                      <span className="text-sm md:text-lg text-gray-500 line-through">
                        ₹{Math.round(product?.price * (1 + product?.discount / 100))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery Information (Placeholder) */}
                <div className="mb-2 md:mb-6 text-gray-700">
                </div>

                {/* Quantity Controls */}
                <div className="mb-2 md:mb-6">
                  <label className="block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2">Quantity</label>
                  <div className="flex items-center gap-1.5 md:gap-3">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(product?._id, -1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 active:bg-primary-600 transition-colors text-gray-600 active:text-white text-[11px] md:text-base"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-center min-w-[30px] md:min-w-[40px] text-[11px] md:text-base">
                        {quantities[product?._id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product?._id, 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 active:bg-primary-600 transition-colors text-gray-600 active:text-white text-[11px] md:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Rating and Reviews */}
                {product?.rating && product?.reviews !== undefined && (
                  <div className="flex items-center mb-1.5 md:mb-4">
                    <div className="flex text-yellow-400 mr-0.5 md:mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 md:w-5 md:h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.729c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] md:text-sm text-gray-600">({product.reviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  handleAddToCart(product);
                  onClose();
                }}
                className="w-full bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-[10px] md:text-base"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: 'https://cdn-icons-png.flaticon.com/128/6785/6785304.png', description: 'Browse all our delicious pickles and other food items.'},
    { id: 'Veg pickles', name: 'Veg Pickles', icon: '/images/veg/veg1.jpg', description: 'Explore our wide range of authentic and delicious vegetarian pickles, crafted with traditional recipes and fresh ingredients. Perfect for adding a tangy kick to any meal!'},
    { id: 'Non veg pickles', name: 'Non-Veg Pickles', icon: '/images/Non-veg/Non-veg1.jpg', description: 'Discover our savory non-vegetarian pickles, made with high-quality meats and rich spices. A perfect accompaniment for a hearty meal.'},
    { id: 'Sweets', name: 'Sweets', icon: '/images/Sweets/swt1.jpg', description: 'Indulge in our delightful selection of traditional Indian sweets, handcrafted to perfection for your festive and daily cravings.'},
    { id: 'Hots', name: 'Hots', icon: '/images/Hots/hot1.jpg', description: 'Spice up your life with our fiery collection of hot and spicy condiments. Ideal for those who love an extra kick in their food.'},
    { id: 'Powders / spices', name: 'Powders / Spices', icon: '/images/Ingredients/Ing1.webp', description: 'Enhance your cooking with our aromatic range of natural spice powders and blends, ground fresh for maximum flavor.'}
  ];

  const allTags = [...new Set(products.flatMap(product => product.tags))];

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .filter(product => selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag)))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b._id - a._id;
        default:
          return b.reviews - a.reviews;
      }
    });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedCategory === 'all') {
          response = await productsApi.getAll();
        } else {
          response = await productsApi.getByCategory(selectedCategory);
        }
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        // Fallback to mock data if API fails
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const filterButton = document.getElementById('filter-button');
      if (showMobileFilters && sidebar && !sidebar.contains(event.target) && !filterButton.contains(event.target)) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileFilters]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + value)
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      const quantity = quantities[product._id] || 1;
      await addToCart({
        ...product,
        quantity
      });
      setShowAddedToCartMessage(true);
      setTimeout(() => {
        setShowAddedToCartMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {showAddedToCartMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm">
          Added to Cart Successfully
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative flex items-center mt-8 md:mt-0">
            <div className="relative w-full">
            <input
              type="text"
                placeholder="Search pickles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
                  className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-2 py-2 md:px-4 md:py-4">
        <div className="flex gap-2 md:gap-4">
          {/* Categories Sidebar */}
          <div className="sticky top-32 z-8 w-20 md:w-28 bg-white rounded-lg shadow-md p-2">
            {/* Categories Section */}
            <div className="mb-4">
              <h3 className="text-xs md:text-sm font-semibold mb-2">Categories</h3>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex flex-col items-center px-1 md:px-2 py-1.5 md:py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mb-1 object-cover"
                    />
                    <span className="text-[10px] md:text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs md:text-sm font-semibold mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer md:[&::-webkit-slider-thumb]:w-4 md:[&::-webkit-slider-thumb]:h-4 md:[&::-moz-range-thumb]:w-4 md:[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 md:py-1.5 md:text-sm"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 md:py-1.5 md:text-sm"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-600">No products found in this category</div>
            ) : (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-1.5 md:gap-3`}>
                {filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Product Image */}
                    <div className="relative">
                      {product.images && product.images.length > 0 ? (
                        <div 
                          className="cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                                className="w-full h-16 md:h-32 object-cover hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ) : (
                            <div className="w-full h-16 md:h-32 bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-[10px] md:text-sm">No image</span>
                        </div>
                      )}
                      {product.discount > 0 && (
                            <div className="absolute top-0.5 right-0.5 bg-red-500 text-white px-1 py-0.5 rounded text-[9px] md:text-xs font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                        <div className="p-1 md:p-2">
                          <h3 className="text-[9px] md:text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                          <p className="text-[8px] md:text-xs text-gray-600 mt-0.5 line-clamp-2">{product.description}</p>
                      
                      {/* Price and Discount */}
                          <div className="mt-0.5">
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-[9px] md:text-sm font-bold text-gray-900">₹{product.price}</span>
                          {product.discount > 0 && (
                                <span className="text-[8px] md:text-xs text-gray-500 line-through">
                              ₹{Math.round(product.price * (1 + product.discount / 100))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls and Add to Cart */}
                          <div className="mt-1 flex items-center gap-1.5">
                            <div className="flex items-center border rounded-md overflow-hidden w-auto">
                          <button
                            onClick={() => handleQuantityChange(product._id, -1)}
                                className="px-1 py-1 bg-gray-100 hover:bg-gray-200 active:bg-primary-600 transition-colors text-gray-600 active:text-white text-[10px] md:text-xs md:px-1.5 md:py-0.5"
                          >
                            -
                          </button>
                              <span className="px-1 py-1 text-center min-w-[20px] md:min-w-[24px] text-[10px] md:text-xs md:px-1.5 md:py-0.5">
                            {quantities[product._id] || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, 1)}
                                className="px-1 py-1 bg-gray-100 hover:bg-gray-200 active:bg-primary-600 transition-colors text-gray-600 active:text-white text-[10px] md:text-xs md:px-1.5 md:py-0.5"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                              className="bg-primary-600 text-white px-0.5 py-0.5 rounded-md hover:bg-primary-700 transition-colors text-[9px] md:text-xs md:px-2 md:py-1 ml-auto"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ImageModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
        handleAddToCart={handleAddToCart}
        categories={categories}
      />
    </div>
  );
};

export default Products; 