const mongoose = require('mongoose');

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: true
    }
  }],
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}));

// Update the updatedAt timestamp before saving
User.schema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = User; 