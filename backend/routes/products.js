const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { upload, convertToRelativePath } = require('../middleware/upload');

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, upload.array('images', 5), convertToRelativePath, createProduct);
router.put('/:id', authenticateToken, isAdmin, upload.array('images', 5), convertToRelativePath, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router; 