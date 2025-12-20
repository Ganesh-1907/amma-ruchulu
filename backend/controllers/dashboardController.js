const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Get comprehensive dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user statistics with their order counts
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          newUsers: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(new Date().setDate(new Date().getDate() - 30))
                  ]
                },
                1,
                0
              ]
            }
          },
          userOrders: {
            $push: {
              userId: '$_id',
              name: '$name',
              email: '$email',
              orderCount: { $size: '$orders' },
              totalSpent: { $sum: '$orders.totalAmount' }
            }
          }
        }
      }
    ]);

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get product statistics
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
          }
        }
      }
    ]);

    // Get daily order statistics for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Fill in missing days with zero values
    const filledDailyOrders = last7Days.map(date => {
      const dayData = dailyOrders.find(d => d._id === date);
      return {
        date,
        orders: dayData ? dayData.count : 0,
        revenue: dayData ? dayData.revenue : 0
      };
    });

    // Get recent orders with user details
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('_id totalAmount status createdAt');

    // Sort user orders by order count
    const sortedUserOrders = userStats[0]?.userOrders.sort((a, b) => b.orderCount - a.orderCount) || [];

    res.json({
      userStats: {
        ...userStats[0],
        userOrders: sortedUserOrders
      } || { totalUsers: 0, activeUsers: 0, newUsers: 0, userOrders: [] },
      orderStats: orderStats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 },
      productStats: productStats[0] || { totalProducts: 0, totalStock: 0, lowStockProducts: 0 },
      dailyStats: filledDailyOrders,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
}; 