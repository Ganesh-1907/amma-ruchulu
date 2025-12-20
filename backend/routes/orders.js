const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// User routes
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrder);
router.post('/', authenticateToken, orderController.createOrder);
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.post('/verify-otp', authenticateToken, orderController.verifyDeliveryOTP);
router.post('/:id/cancel', authenticateToken, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticateToken, authorizeRoles('admin'), orderController.getAllOrders);
router.get('/admin/:id', authenticateToken, authorizeRoles('admin'), orderController.getOrder);
router.put('/admin/status/:id', authenticateToken, authorizeRoles('admin'), orderController.updateOrderStatus);

module.exports = router; 