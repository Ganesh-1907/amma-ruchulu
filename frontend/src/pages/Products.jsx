import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { products as productsApi } from "../services/api";
import { mockProducts } from "../data/mockProducts";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// Helper function to get image URL
const getImageUrl = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;

  // remove trailing /api if present
  const baseUrl = BACKEND_URL.replace(/\/api\/?$/, "");

  return `${baseUrl}/${img.replace(/^\//, "")}`;
};

const getSelectedPriceObj = (product, selectedWeight) => {
  if (!product?.prices?.length) return null;

  const weight = selectedWeight?.[product._id] || product.prices[0].weight;

  return product.prices.find((p) => p.weight === weight);
};

const getFinalPrice = (product, selectedWeight) => {
  const priceObj = getSelectedPriceObj(product, selectedWeight);
  if (!priceObj) return 0;

  if (product.isDiscountActive && product.discount > 0) {
    return Math.round(priceObj.price * (1 - product.discount / 100));
  }
  return priceObj.price;
};

const getBasePrice = (product, selectedWeight) => {
  if (!product?.prices?.length) return 0;

  const weight = selectedWeight?.[product._id] || product.prices[0].weight;
  const priceObj = product.prices.find((p) => p.weight === weight);

  return priceObj ? priceObj.price : 0;
};

// Image Modal Component
const ImageModal = ({
  isOpen,
  onClose,
  product,
  quantities,
  handleQuantityChange,
  handleAddToCart,
  categories,
  selectedWeight,
  setSelectedWeight,
}) => {
  if (!isOpen) return null;

  const categoryDescription =
    categories.find((cat) => cat.id === product?.category)?.description || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative max-w-[320px] md:max-w-4xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          ✕
        </button>

        <div className="bg-white rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4 p-4">
            {/* 🔒 FIXED IMAGE SECTION */}
            <div className="relative w-full h-[260px] md:h-[420px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={
                  product?.images?.[0]
                    ? getImageUrl(product.images[0])
                    : "/placeholder.png"
                }
                alt={product?.name}
                className="max-h-full max-w-full object-contain"
              />

              {product?.discount > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  {product?.name}
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                  {categoryDescription}
                </p>

                {/* 🟢 GREEN WEIGHT SELECTOR */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.prices.map((p) => {
                    const active =
                      (selectedWeight[product._id] ||
                        product.prices[0].weight) === p.weight;

                    return (
                      <button
                        key={p.weight}
                        onClick={() =>
                          setSelectedWeight((prev) => ({
                            ...prev,
                            [product._id]: p.weight,
                          }))
                        }
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          active
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
                        }`}
                      >
                        {p.weight}
                      </button>
                    );
                  })}
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{getFinalPrice(product, selectedWeight)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-gray-400 line-through">
                      ₹{getBasePrice(product, selectedWeight)}
                    </span>
                  )}
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => handleQuantityChange(product._id, -1)}
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>
                  <span className="font-medium">
                    {quantities[product._id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product._id, 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => {
                  handleAddToCart(product);
                  onClose();
                }}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState({});

  const categories = [
    {
      id: "all",
      name: "All Products",
      icon: "https://cdn-icons-png.flaticon.com/128/6785/6785304.png",
      description: "Browse all our delicious pickles and other food items.",
    },
    {
      id: "Veg pickles",
      name: "Veg Pickles",
      icon: "/images/veg/veg1.jpg",
      description:
        "Explore our wide range of authentic and delicious vegetarian pickles, crafted with traditional recipes and fresh ingredients. Perfect for adding a tangy kick to any meal!",
    },
    {
      id: "Non veg pickles",
      name: "Non-Veg Pickles",
      icon: "/images/Non-veg/Non-veg1.jpg",
      description:
        "Discover our savory non-vegetarian pickles, made with high-quality meats and rich spices. A perfect accompaniment for a hearty meal.",
    },
    {
      id: "Sweets",
      name: "Sweets",
      icon: "/images/Sweets/swt1.jpg",
      description:
        "Indulge in our delightful selection of traditional Indian sweets, handcrafted to perfection for your festive and daily cravings.",
    },
    {
      id: "Hots",
      name: "Hots",
      icon: "/images/Hots/hot1.jpg",
      description:
        "Spice up your life with our fiery collection of hot and spicy condiments. Ideal for those who love an extra kick in their food.",
    },
    {
      id: "Powders / spices",
      name: "Powders / Spices",
      icon: "/images/Ingredients/Ing1.webp",
      description:
        "Enhance your cooking with our aromatic range of natural spice powders and blends, ground fresh for maximum flavor.",
    },
  ];

  const allTags = [...new Set(products.flatMap((product) => product.tags))];

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => {
      const price = getBasePrice(product, selectedWeight);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .filter(
      (product) =>
        selectedTags.length === 0 ||
        selectedTags.some((tag) => product.tags?.includes(tag))
    )
    .sort((a, b) => {
      const priceA = getBasePrice(a, selectedWeight);
      const priceB = getBasePrice(b, selectedWeight);

      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

  console.log(filteredProducts, "ganesh");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedCategory === "all") {
          response = await productsApi.getAll();
        } else {
          response = await productsApi.getByCategory(selectedCategory);
        }
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
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
      const sidebar = document.getElementById("mobile-sidebar");
      const filterButton = document.getElementById("filter-button");
      if (
        showMobileFilters &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !filterButton.contains(event.target)
      ) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileFilters]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + value),
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      const quantity = quantities[product._id] || 1;
      const weight = selectedWeight[product._id] || product.prices[0].weight;

      const priceObj = product.prices.find((p) => p.weight === weight);
      const basePrice = priceObj.price;

      const finalPrice =
        product.discount > 0
          ? Math.round(basePrice * (1 - product.discount / 100))
          : basePrice;

      await addToCart({
        ...product,
        quantity,
        selectedWeight: weight,
        unitPrice: finalPrice,
        basePrice,
        totalPrice: finalPrice * quantity,
      });

      setShowAddedToCartMessage(true);
      setTimeout(() => setShowAddedToCartMessage(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
              <h3 className="text-xs md:text-sm font-semibold mb-2">
                Categories
              </h3>
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex flex-col items-center px-1 md:px-2 py-1.5 md:py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-100 text-primary-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mb-1 object-cover"
                    />
                    <span className="text-[10px] md:text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs md:text-sm font-semibold mb-3">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer md:[&::-webkit-slider-thumb]:w-4 md:[&::-webkit-slider-thumb]:h-4 md:[&::-moz-range-thumb]:w-4 md:[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 md:py-1.5 md:text-sm"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 md:py-1.5 md:text-sm"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
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
                  <div className="text-center text-gray-600">
                    No products found in this category
                  </div>
                ) : (
                  <div
                    className={`grid ${
                      viewMode === "grid"
                        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
                        : "grid-cols-1"
                    } gap-4 md:gap-6`}
                  >
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                      >
                        {/* IMAGE – Bigger & Cleaner */}
                        <div
                          className="relative cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="absolute inset-0 rounded-xl ring-1 ring-black/10 pointer-events-none"></div>

                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-48 md:h-60 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                          />

                          {product.discount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-4 flex flex-col flex-1">
                          {/* Title */}
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                            {product.name}
                          </h3>

                          {/* Description */}
                          <p className="text-xs md:text-sm text-gray-500 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Weight Selector */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {product.prices.map((p) => {
                              const active =
                                (selectedWeight[product._id] ||
                                  product.prices[0].weight) === p.weight;

                              return (
                                <button
                                  key={p.weight}
                                  onClick={() =>
                                    setSelectedWeight((prev) => ({
                                      ...prev,
                                      [product._id]: p.weight,
                                    }))
                                  }
                                  className={`px-3 py-1 text-xs rounded-full border transition ${
                                    active
                                      ? "bg-primary-600 text-white border-primary-600"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                                  }`}
                                >
                                  {p.weight}
                                </button>
                              );
                            })}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg md:text-xl font-bold text-gray-900">
                              ₹{getFinalPrice(product, selectedWeight)}
                            </span>

                            {product.discount > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{getBasePrice(product, selectedWeight)}
                              </span>
                            )}
                          </div>

                          {/* ACTION ROW */}
                          <div className="mt-auto flex items-center gap-3">
                            {/* Quantity */}
                            <div className="flex items-center border rounded-lg overflow-hidden h-9">
                              <button
                                onClick={() =>
                                  handleQuantityChange(product._id, -1)
                                }
                                className="px-3 h-full bg-gray-100 hover:bg-gray-200"
                              >
                                −
                              </button>
                              <span className="px-3 text-sm font-medium">
                                {quantities[product._id] || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(product._id, 1)
                                }
                                className="px-3 h-full bg-gray-100 hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>

                            {/* ADD TO CART – SAME HEIGHT */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="h-9 px-4 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition whitespace-nowrap"
                            >
                              Add To Cart
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
        selectedWeight={selectedWeight}
        setSelectedWeight={setSelectedWeight}
      />
    </div>
  );
};

export default Products;
