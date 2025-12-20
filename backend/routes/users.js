const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Protected routes
router.use(authenticateToken);

// Admin routes
router.get('/', admin, userController.getAllUsers);
router.put('/:id/status', admin, userController.updateStatus);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.post('/reset-password', userController.resetPassword);

// Get user statistics (admin only)
router.get('/stats', admin, userController.getUserStats);

module.exports = router; 