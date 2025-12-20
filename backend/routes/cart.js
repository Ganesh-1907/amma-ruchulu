const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Cart = require('../models/Cart');

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Add item to cart
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item to cart' });
  }
});

// Update cart item quantity
router.patch('/items/:productId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    
    const updatedCart = await cart.populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart item' });
  }
});

// Remove item from cart
router.delete('/items/:productId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    
    const updatedCart = await cart.populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
});

module.exports = router; 