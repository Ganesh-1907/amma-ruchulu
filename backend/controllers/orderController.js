const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const {
  sendOrderConfirmationToUser,
  sendOrderNotificationToAdmin,
} = require("../utils/emailService");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const decreaseProductStock = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const priceEntry = product.prices.find(
      (p) => p.weight === item.selectedWeight
    );

    if (!priceEntry) continue;

    // 🔻 decrease stock
    priceEntry.stock = Math.max(
      0,
      Number(priceEntry.stock) - Number(item.quantity)
    );

    await product.save();
  }
};


// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "name email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Get a single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Return the complete order object including payment status
    res.json({
      order: {
        ...order.toObject(),
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Error fetching order" });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      deliveryDate,
      deliveryTime,
      paymentStatus,
      paymentMethod
    } = req.body;

    // 🔐 basic validation
    if (!items || !items.length) {
      return res.status(400).json({ error: "Order items are required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    const userId = req.user._id;

    // ✅ CREATE ORDER
    const order = new Order({
      user: userId,
      items,
      address,
      deliveryDate,
      deliveryTime,

      // 🔥 totalAmount from totalPrice (NO NaN)
      totalAmount: items.reduce(
        (sum, item) => sum + Number(item.totalPrice),
        0
      ),

      status: "pending",
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Pending",
    });

    await order.save();

    // ✅ Populate for emails
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "email name")
      .populate("items.product", "name");

    if (!populatedOrder) {
      throw new Error("Failed to populate order details");
    }

    // ✅ Format address
    const formattedAddress = `
${address.street}
${address.city}, ${address.state}
PIN: ${address.pincode}
    `.trim();

    // ✅ Email payload (CORRECT)
    const orderDetails = {
      orderId: order._id,
      orderDate: order.createdAt,
      items: order.items.map(item => ({
        name: item.product?.name,
        quantity: item.quantity,
        price: item.totalPrice
      })),
      totalAmount: order.totalAmount,
      userEmail: populatedOrder.user.email,
      userName: populatedOrder.user.name,
      address: formattedAddress,
      deliveryDate,
      deliveryTime,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    };

    // 📧 Send emails
    await sendOrderConfirmationToUser(
      populatedOrder.user.email,
      orderDetails
    );

    await sendOrderNotificationToAdmin(orderDetails);

    // ✅ FINAL RESPONSE
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        deliveryDate,
        deliveryTime,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create order: " + error.message
    });
  }
};


// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = [
      "pending",
      "confirmed",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const wasDelivered = order.status === "delivered";

    // 🔥 STOCK REDUCTION (ONLY ONCE)
    if (!wasDelivered && status === "delivered") {
      await decreaseProductStock(order);

      // COD → mark paid
      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("items.product")
      .populate("user", "name email phone");

    res.json({
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error updating order status" });
  }
};



// Verify delivery OTP
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔥 ONLY IF NOT ALREADY DELIVERED
    if (order.status !== "delivered") {
      await decreaseProductStock(order);

      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }

      order.status = "delivered";
      await order.save();
    }

    res.json({ success: true, message: "Order delivered successfully" });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ error: "Delivery verification failed" });
  }
};





// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    // ✅ Update order status
    order.status = "cancelled";

    // ✅ Payment status handling (ENUM SAFE)
    if (order.paymentMethod === "Online") {
      if (order.paymentStatus === "Paid") {
        order.paymentStatus = "Refund Pending";
      }
    } else if (order.paymentMethod === "COD") {
      order.paymentStatus = "Failed";
    }

    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Error cancelling order" });
  }
};



// Get order statistics (for admin)
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $match: { status: { $ne: "cancelled" } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ error: "Error fetching order statistics" });
  }
};
