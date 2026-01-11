const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      selectedWeight,
      unitPrice,
      quantity,
      totalPrice
    } = req.body;

    // 1️⃣ Validate input
    if (!productId || !selectedWeight || !unitPrice || !quantity || !totalPrice) {
      return res.status(400).json({ error: 'Missing cart fields' });
    }

    // 2️⃣ Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 3️⃣ Find or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // 4️⃣ Find SAME product + SAME weight
    const existingItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.selectedWeight === selectedWeight
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice =
        existingItem.unitPrice * existingItem.quantity;
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
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
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
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    console.log("✅ ITEM REMOVED:", itemId);
    res.json({ items: cart.items });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 