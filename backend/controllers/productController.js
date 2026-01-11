const Product = require('../models/Product');
const path = require('path');
const fs = require('fs').promises;
const { getFinalPrice } = require('../utils/priceCalculator');


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const result = products.map(product => {
      const obj = product.toObject();
      obj.prices = obj.prices.map(p => ({
        ...p,
        finalPrice: getFinalPrice(p.price, product)
      }));
      return obj;
    });

    res.json(result);
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
      category,
      prices,
      discount,
      isDiscountActive,
      discountStartDate,
      discountEndDate,
      expiryDays
    } = req.body;

    const parsedPrices =
      typeof prices === 'string' ? JSON.parse(prices) : prices;

    // 🔴 REQUIRED WEIGHT VALIDATION
    const requiredWeights = ['250g', '500g', '1kg'];
    const receivedWeights = parsedPrices.map(p => p.weight);

    for (const w of requiredWeights) {
      if (!receivedWeights.includes(w)) {
        return res.status(400).json({ error: `Missing price for ${w}` });
      }
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      description,
      category,
      images,
      prices: parsedPrices,
      discount,
      isDiscountActive,
      discountStartDate,
      discountEndDate,
      expiryDays
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

    if (updateData.prices) {
      updateData.prices =
        typeof updateData.prices === 'string'
          ? JSON.parse(updateData.prices)
          : updateData.prices;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);

      const existingProduct = await Product.findById(productId);
      if (existingProduct) {
        for (const oldImage of existingProduct.images) {
          if (!newImages.includes(oldImage)) {
            try {
              await fs.unlink(oldImage);
            } catch (err) {
              console.error('Image delete error:', err);
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

    const obj = product.toObject();
    obj.prices = obj.prices.map(p => ({
      ...p,
      finalPrice: getFinalPrice(p.price, product)
    }));

    res.json(obj);
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