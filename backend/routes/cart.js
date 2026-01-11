const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Cart = require('../models/Cart');

/**
 * ✅ GET USER CART
 * Returns: { items: [...] }
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error('GET CART ERROR:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
});


/**
 * ✅ ADD ITEM TO CART (product + weight based)
 */
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const {
      productId,
      selectedWeight,
      unitPrice,
      quantity,
      totalPrice
    } = req.body;

    if (!productId || !selectedWeight || !unitPrice || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Missing required cart fields' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // SAME product + SAME weight
    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.selectedWeight === selectedWeight
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
    } else {
      cart.items.push({
        product: productId,
        selectedWeight,
        unitPrice,
        quantity,
        totalPrice
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({ items: cart.items });
  } catch (error) {
    console.error('ADD TO CART ERROR:', error);
    res.status(500).json({ error: 'Error adding item to cart' });
  }
});


/**
 * ✅ UPDATE CART ITEM QUANTITY (by cart item _id)
 */
router.patch('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    item.quantity = quantity;
    item.totalPrice = item.unitPrice * quantity;

    await cart.save();
    await cart.populate('items.product');

    res.json({ items: cart.items });
  } catch (error) {
    console.error('UPDATE CART ERROR:', error);
    res.status(500).json({ error: 'Error updating cart item' });
  }
});


/**
 * ✅ REMOVE SINGLE CART ITEM (by cart item _id)
 * 🔥 THIS IS THE FIX FOR YOUR ISSUE
 */
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error('REMOVE CART ITEM ERROR:', error);
    res.status(500).json({ error: 'Error removing item from cart' });
  }
});


/**
 * ✅ CLEAR ENTIRE CART
 */
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await Cart.updateOne(
      { user: req.user.id },
      { $set: { items: [] } }
    );

    res.json({ items: [] });
  } catch (error) {
    console.error('CLEAR CART ERROR:', error);
    res.status(500).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;
