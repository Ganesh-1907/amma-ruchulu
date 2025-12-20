const Product = require('../models/Product');
const path = require('path');
const fs = require('fs').promises;

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      unit,
      discount,
      isDiscountActive,
      discountStartDate,
      discountEndDate,
      offerPrice,
      offerStartDate,
      offerEndDate,
      isOfferActive
    } = req.body;

    // Handle image uploads
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      unit,
      images,
      discount,
      isDiscountActive,
      discountStartDate,
      discountEndDate,
      offerPrice,
      offerStartDate,
      offerEndDate,
      isOfferActive
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      
      // Get existing product to handle old images
      const existingProduct = await Product.findById(productId);
      if (existingProduct) {
        // Delete old images that are not in the new set
        const oldImages = existingProduct.images || [];
        for (const oldImage of oldImages) {
          if (!newImages.includes(oldImage)) {
            try {
              await fs.unlink(oldImage);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          }
        }
      }
      
      updateData.images = newImages;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... existing code ...

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images
    for (const image of product.images) {
      try {
        const fullPath = path.join(__dirname, '..', image);
        await fs.unlink(fullPath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    // Use findByIdAndDelete instead of remove()
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... existing code ...

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
}; 