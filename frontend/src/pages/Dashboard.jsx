import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import UserManagement from '../components/admin/UserManagement';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      userOrders: []
    },
    orderStats: {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      deliveredOrders: 0
    },
    productStats: {
      totalProducts: 0,
      totalStock: 0,
      lowStockProducts: 0
    },
    dailyStats: [],
    recentOrders: [],
    topProducts: []
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/dashboard/stats');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Ensure all data is properly initialized with default values
      const safeData = {
        userStats: {
          totalUsers: response.data?.userStats?.totalUsers || 0,
          activeUsers: response.data?.userStats?.activeUsers || 0,
          newUsers: response.data?.userStats?.newUsers || 0,
          userOrders: (response.data?.userStats?.userOrders || [])
            .filter(order => order && order.userId)
            .map(order => ({
              userId: order.userId || 'unknown',
              name: order.name || 'Unknown User',
              email: order.email || 'No email',
              orderCount: order.orderCount || 0,
              totalSpent: order.totalSpent || 0
            }))
        },
        orderStats: {
          totalOrders: response.data?.orderStats?.totalOrders || 0,
          totalRevenue: response.data?.orderStats?.totalRevenue || 0,
          pendingOrders: response.data?.orderStats?.pendingOrders || 0,
          deliveredOrders: response.data?.orderStats?.deliveredOrders || 0
        },
        productStats: {
          totalProducts: response.data?.productStats?.totalProducts || 0,
          totalStock: response.data?.productStats?.totalStock || 0,
          lowStockProducts: response.data?.productStats?.lowStockProducts || 0
        },
        dailyStats: (response.data?.dailyStats || [])
          .filter(stat => stat && stat.date)
          .map(stat => ({
            date: stat.date,
            orders: stat.orders || 0,
            revenue: stat.revenue || 0
          })),
        recentOrders: (response.data?.recentOrders || [])
          .filter(order => order && order._id)
          .map(order => ({
            _id: order._id,
            totalAmount: order.totalAmount || 0,
            status: order.status || 'pending',
            user: {
              name: order.user?.name || 'Unknown User',
              email: order.user?.email || 'No email'
            }
          })),
        topProducts: (response.data?.topProducts || [])
          .filter(product => product && product._id)
          .map(product => ({
            _id: product._id,
            name: product.name || 'Unknown Product',
            totalSold: product.totalSold || 0,
            totalRevenue: product.totalRevenue || 0
          }))
      };

      setStats(safeData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      toast.error(error.message || 'Failed to load dashboard data');
      // Set default values when there's an error
      setStats({
        userStats: {
          totalUsers: 0,
          activeUsers: 0,
          newUsers: 0,
          userOrders: []
        },
        orderStats: {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          deliveredOrders: 0
        },
        productStats: {
          totalProducts: 0,
          totalStock: 0,
          lowStockProducts: 0
        },
        dailyStats: [],
        recentOrders: [],
        topProducts: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchDashboardData();
      toast.success('Dashboard data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
      toast.error('Failed to refresh dashboard data');
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Chart data for orders over time
  const ordersChartData = {
    labels: stats.dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.dailyStats.map(stat => stat.orders),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: stats.dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stats.dailyStats.map(stat => stat.revenue),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Chart data for order status distribution
  const orderStatusData = {
    labels: ['Pending', 'Delivered'],
    datasets: [
      {
        data: [stats.orderStats.pendingOrders, stats.orderStats.deliveredOrders],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold">{stats.userStats.totalUsers}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.userStats.newUsers} new this month
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
              <p className="text-3xl font-bold">{stats.orderStats.totalOrders}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.orderStats.pendingOrders} pending
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{stats.orderStats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.orderStats.deliveredOrders} delivered
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Products</h3>
              <p className="text-3xl font-bold">{stats.productStats.totalProducts}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.productStats.lowStockProducts} low in stock
              </p>
            </div>
          </div>

          {/* User Orders Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">User Order Statistics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Total Orders</th>
                    <th className="px-4 py-2 text-left">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userStats.userOrders.map((userOrder) => (
                    <tr key={userOrder.userId}>
                      <td className="px-4 py-2">{userOrder.name}</td>
                      <td className="px-4 py-2">{userOrder.email}</td>
                      <td className="px-4 py-2">{userOrder.orderCount}</td>
                      <td className="px-4 py-2">₹{userOrder.totalSpent.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Orders Over Time</h3>
              <Line data={ordersChartData} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Revenue</h3>
              <Bar data={revenueChartData} />
            </div>
          </div>

          {/* Order Status and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Order Status Distribution</h3>
              <div className="h-64">
                <Pie data={orderStatusData} />
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-2">{order._id}</td>
                        <td className="px-4 py-2">{order.user?.name || 'Unknown User'}</td>
                        <td className="px-4 py-2">₹{order.totalAmount}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Units Sold</th>
                    <th className="px-4 py-2 text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.totalSold}</td>
                      <td className="px-4 py-2">₹{product.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <UserManagement />
      )}
    </div>
  );
};

export default Dashboard; 