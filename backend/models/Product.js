const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Shop all', 'Veg pickles', 'Non veg pickles', 'Sweets', 'Hots', 'Powders / spices']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['100g', '250g', '500g', '1kg']
  },
  images: [{
    type: String,
    required: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isDiscountActive: {
    type: Boolean,
    default: false
  },
  discountStartDate: {
    type: Date
  },
  discountEndDate: {
    type: Date
  },
  offerPrice: {
    type: Number,
    min: 0
  },
  offerStartDate: {
    type: Date
  },
  offerEndDate: {
    type: Date
  },
  isOfferActive: {
    type: Boolean,
    default: false
  },
  expiryDays: {
    type: Number,
    default: 7
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 