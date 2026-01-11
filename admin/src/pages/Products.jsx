import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/api";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const toastShownRef = useRef(false);

  const [selectedCategory, setSelectedCategory] = useState("All");


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Shop all",

    prices: [
      { weight: "250g", price: "", stock: "" },
      { weight: "500g", price: "", stock: "" },
      { weight: "1kg", price: "", stock: "" },
    ],

    images: [],
    imagePreviews: [],

    discount: 0,
    isDiscountActive: false,
    discountStartDate: "",
    discountEndDate: "",
  });

  // const CATEGORIES = ['milk', 'curd', 'butter', 'ghee', 'cheese', 'other'];

  //CAPITAL LETTERS
  const CATEGORIES = [
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

      // Basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);

      // Prices (IMPORTANT: send as JSON)
      formDataToSend.append("prices", JSON.stringify(formData.prices));

      // Discount
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("isDiscountActive", formData.discount > 0);
      formDataToSend.append("discountStartDate", formData.discountStartDate);
      formDataToSend.append("discountEndDate", formData.discountEndDate);

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

  const handleEdit = (product) => {
    setEditingProductId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,

      prices: product.prices.map((p) => ({
        weight: p.weight,
        price: p.price,
        stock: p.stock,
      })),

      images: [],
      imagePreviews: product.images.map((img) => getImageUrl(img)),

      discount: product.discount || 0,
      isDiscountActive: product.discount > 0,

      discountStartDate: product.discountStartDate
        ? product.discountStartDate.split("T")[0]
        : "",

      discountEndDate: product.discountEndDate
        ? product.discountEndDate.split("T")[0]
        : "",
    });

    setIsModalOpen(true);
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
    const cleanPath = imagePath.replace(/^\/+/, "");
    return `${API_URL}/${cleanPath}`;
  };

  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        (product) => product.category === selectedCategory
      );


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen pb-20 md:pb-6">
     <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
  <h1 className="text-2xl md:text-3xl font-bold text-black-800">
    Products
  </h1>

  <div className="flex gap-3 items-center">
    {/* CATEGORY FILTER */}
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <option value="All">All Categories</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>

    {/* ADD PRODUCT */}
    <button
      onClick={() => {
        setFormData({
          name: "",
          description: "",
          category: "Shop all",
          prices: [
            { weight: "250g", price: "", stock: "" },
            { weight: "500g", price: "", stock: "" },
            { weight: "1kg", price: "", stock: "" },
          ],
          images: [],
          imagePreviews: [],
          discount: 0,
          isDiscountActive: false,
          discountStartDate: "",
          discountEndDate: "",
        });
        setIsModalOpen(true);
      }}
      className="bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
    >
      Add Product
    </button>
  </div>
</div>


      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {filteredProducts.map((product) => (
  <div
    key={product._id}
    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden"
  >
    {/* IMAGE */}
    <div className="relative h-44 md:h-52 bg-gray-50 overflow-hidden">
      {product.images?.length > 0 ? (
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No Image
        </div>
      )}

      {product.discount > 0 && (
        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
          {product.discount}% OFF
        </span>
      )}
    </div>

    {/* CONTENT */}
    <div className="p-4 flex flex-col flex-1">
      {/* NAME */}
      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
        {product.name}
      </h3>

      {/* CATEGORY */}
      <p className="text-xs text-gray-500 mb-2">
        Category: {product.category}
      </p>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {product.description}
      </p>

      {/* PRICE TABLE */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Prices & Stock
        </p>

        <div className="space-y-1">
          {product.prices.map((p) => (
            <div
              key={p.weight}
              className="flex justify-between items-center text-xs text-gray-700"
            >
              <span className="font-medium">{p.weight}</span>
              <span>₹{p.price}</span>
              <span
                className={`text-[11px] font-medium ${
                  p.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Stock: {p.stock}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => handleEdit(product)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(product._id)}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          Delete
        </button>
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

                {/* Prices & Stock per weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prices & Stock (per weight)
                  </label>

                  <div className="space-y-3">
                    {formData.prices.map((item, index) => (
                      <div
                        key={item.weight}
                        className="grid grid-cols-3 gap-3 items-center"
                      >
                        {/* Weight */}
                        <span className="text-sm font-semibold text-gray-700">
                          {item.weight}
                        </span>

                        {/* Price */}
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => {
                            const updated = [...formData.prices];
                            updated[index].price = e.target.value;
                            setFormData({ ...formData, prices: updated });
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />

                        {/* Stock */}
                        <input
                          type="number"
                          placeholder="Stock"
                          value={item.stock}
                          onChange={(e) => {
                            const updated = [...formData.prices];
                            updated[index].stock = e.target.value;
                            setFormData({ ...formData, prices: updated });
                          }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
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
