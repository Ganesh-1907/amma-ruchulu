const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token in authorization header');
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action'
      });
    }
    next();
  };
}; 