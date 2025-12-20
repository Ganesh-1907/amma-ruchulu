const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get dashboard statistics (admin only)
router.get('/stats', authenticateToken, admin, dashboardController.getDashboardStats);

module.exports = router; 