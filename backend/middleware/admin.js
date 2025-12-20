const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = admin; 