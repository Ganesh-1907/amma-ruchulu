const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      enum: ['250g', '500g', '1kg'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Shop all',
        'Veg pickles',
        'Non veg pickles',
        'Sweets',
        'Hots',
        'Powders / spices'
      ]
    },

    images: [
      {
        type: String,
        required: true
      }
    ],

    // 🔥 Prices for 250g, 500g, 1kg
    prices: {
      type: [priceSchema],
      required: true,
      validate: (v) => v.length > 0
    },

    // 🔥 SAME DISCOUNT FOR ALL WEIGHTS
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

    isAvailable: {
      type: Boolean,
      default: true
    },

    expiryDays: {
      type: Number,
      default: 7
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
