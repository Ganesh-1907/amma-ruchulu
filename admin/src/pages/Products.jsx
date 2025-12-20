import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const toastShownRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    // category: 'milk',
    category: "shop all",

    stock: "",
    unit: "",
    images: [],
    imagePreviews: [],
    discount: 0,
    isDiscountActive: false,
    discountStartDate: "",
    discountEndDate: "",
    offerPrice: "",
    offerStartDate: "",
    offerEndDate: "",
    isOfferActive: false,
  });

  // const CATEGORIES = ['milk', 'curd', 'butter', 'ghee', 'cheese', 'other'];

  //CAPITAL LETTERS
  const CATEGORIES = [
    "Shop all",
    "Veg pickles",
    "Non veg pickles",
    "Sweets",
    "Hots",
    "Powders / spices",
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.products.getAll();
        setProducts(response.data);
        if (!toastShownRef.current) {
          toast.success("Products loaded successfully");
          toastShownRef.current = true;
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        if (!toastShownRef.current) {
          toast.error("Failed to load products");
          toastShownRef.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      toastShownRef.current = false;
    };
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files would exceed the 4 image limit
    if (formData.images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    // Check file sizes
    const invalidFiles = files.filter((file) => file.size > 2 * 1024 * 1024); // 2MB limit
    if (invalidFiles.length > 0) {
      toast.error("Some images exceed 2MB limit");
      return;
    }

    // Create a unique identifier for each file (name + size)
    const getFileIdentifier = (file) => `${file.name}-${file.size}`;

    // Check for duplicate files using the identifier
    const existingFileIdentifiers = new Set(
      formData.images.map(getFileIdentifier)
    );
    const duplicateFiles = files.filter((file) =>
      existingFileIdentifiers.has(getFileIdentifier(file))
    );

    if (duplicateFiles.length > 0) {
      toast.error("Some images are already added");
      return;
    }

    // Create preview URLs for all files
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.imagePreviews];

      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);

      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "images" && key !== "imagePreviews") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append all new images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      // Add required fields
      formDataToSend.append("isAvailable", true);
      formDataToSend.append("expiryDays", 7); // Default expiry days

      let response;
      if (editingProductId) {
        // Update existing product
        response = await adminApi.products.update(
          editingProductId,
          formDataToSend
        );
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        response = await adminApi.products.create(formDataToSend);
        toast.success("Product created successfully!");
      }

      // Refresh products list
      const productsResponse = await adminApi.products.getAll();
      setProducts(productsResponse.data);

      setIsModalOpen(false);
      setEditingProductId(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(error.response?.data?.error || "Failed to save product");
    }
  };

  const handleEdit = async (product) => {
    try {
      setEditingProductId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        unit: product.unit,
        images: [],
        imagePreviews: product.images.map((image) => getImageUrl(image)),
        discount: product.discount || 0,
        isDiscountActive: product.isDiscountActive || false,
        discountStartDate: product.discountStartDate || "",
        discountEndDate: product.discountEndDate || "",
        offerPrice: product.offerPrice || "",
        offerStartDate: product.offerStartDate || "",
        offerEndDate: product.offerEndDate || "",
        isOfferActive: product.isOfferActive || false,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load product for editing:", error);
      toast.error("Failed to load product for editing");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await adminApi.products.delete(productId);

      // Refresh products list
      const response = await adminApi.products.getAll();
      setProducts(response.data);

      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  };

  const calculateDiscount = (price, offerPrice) => {
    if (!offerPrice) return 0;
    return Math.round(((price - offerPrice) / price) * 100);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  // Add this function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Remove any leading slashes and ensure proper path construction
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${API_URL}/${cleanPath}`;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black-800">
          Products
        </h1>
        <button
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              price: "",
              // category: 'milk',
              category: "shop all",
              stock: "",
              unit: "",
              images: [],
              imagePreviews: [],
              discount: 0,
              isDiscountActive: false,
              discountStartDate: "",
              discountEndDate: "",
              offerPrice: "",
              offerStartDate: "",
              offerEndDate: "",
              isOfferActive: false,
            });
            setIsModalOpen(true);
          }}
          // className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 w-full md:w-auto"
          className="bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 w-full md:w-auto"
        >
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
          >
            {/* Product Image */}
            <div className="w-full h-32 sm:h-40 md:h-48 relative group overflow-hidden">
              {product.isOfferActive && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                  {calculateDiscount(product.price, product.offerPrice)}% OFF
                </div>
              )}
              {product.images && product.images.length > 0 ? (
                <div className="relative h-48">
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <div className="absolute bottom-0 right-0 p-2 flex gap-2">
                      {product.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 2}`}
                          className="w-12 h-12 object-cover rounded-lg border-2 border-white"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="p-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <p className="text-xs font-semibold text-gray-800">
                  {product.name}
                </p>
                <p className="text-[10px] text-gray-600">{product.unit}</p>
              </div>
              <div className="mt-0.5 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 text-[10px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900 text-[10px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProductId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>
              <form onSubmit={handleSubmit} className="space-y-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Unit</option>
                    <option value="100g">100g</option>
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1 Kilogram (1kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (up to 4)
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.imagePreviews.length < 4 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32">
                        <label className="cursor-pointer p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="text-gray-500">
                            <svg
                              className="mx-auto h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <p className="mt-1 text-sm">Add Images</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        discount,
                        isDiscountActive: discount > 0,
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {formData.discount > 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.discountStartDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountStartDate: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Discount End Date
                      </label>
                      <input
                        type="date"
                        value={formData.discountEndDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountEndDate: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-sm text-yellow-700">
                        Discounted Price: ₹
                        {calculateDiscountedPrice(
                          formData.price,
                          formData.discount
                        ).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProductId(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    {editingProductId ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
