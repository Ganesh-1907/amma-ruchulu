import { useState, useEffect, useRef } from 'react';
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
import { Line, Pie, Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';

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

const Dashboard = () => {
  const toastShownRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenueChange: 0,
    lastMonthRevenue: 0,
    averageOrderValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({
    labels: ['Delivered', 'Processing', 'Pending', 'Cancelled'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 1,
    }],
  });

  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Revenue',
      data: [],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.4,
    }],
  });

  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchDashboardData();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        if (!toastShownRef.current) {
          toast.error('Failed to load dashboard data');
          toastShownRef.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // Set up polling every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => {
      clearInterval(interval);
      toastShownRef.current = false;
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all required data in parallel
      const [ordersResponse, productsResponse,customersResponse] = await Promise.all([
        adminApi.orders.getAll(),
        adminApi.products.getAll(),
         adminApi.users.getAll(),
      ]);

      const orders = ordersResponse.data;
      const products = productsResponse.data;
  const customers = customersResponse.data.filter(user => user.role === 'user');

      // Calculate current month's revenue
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });

      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      });

      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const revenueChange = lastMonthRevenue ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Calculate average order value
      const averageOrderValue = orders.length ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0;

      // Calculate stats
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalProducts = products.length;
      const totalCustomers = 0;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        revenueChange,
        lastMonthRevenue,
        averageOrderValue,
      });

      // Get recent orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
          id: order._id,
          customer: order.user?.name || 'N/A',
          amount: order.totalAmount,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString(),
        }));

      setRecentOrders(recentOrders);

      // Calculate order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      setOrderStatusData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: [
            statusCounts.delivered || 0,
            statusCounts.processing || 0,
            statusCounts.pending || 0,
            statusCounts.cancelled || 0,
          ],
        }],
      }));

      // Calculate revenue by month
      const monthlyRevenue = orders.reduce((acc, order) => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.totalAmount;
        return acc;
      }, {});

      const months = Object.keys(monthlyRevenue);
      const revenue = Object.values(monthlyRevenue);

      setRevenueData(prev => ({
        ...prev,
        labels: months,
        datasets: [{
          ...prev.datasets[0],
          data: revenue,
        }],
      }));

      // Get top selling products
      const productSales = orders.reduce((acc, order) => {
        order.items.forEach(item => {
          acc[item.product._id] = (acc[item.product._id] || 0) + item.quantity;
        });
        return acc;
      }, {});

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([productId, quantity]) => {
          const product = products.find(p => p._id === productId);
          return {
            id: productId,
            name: product?.name || 'Unknown Product',
            quantity,
            revenue: product?.price * quantity || 0,
          };
        });

      setTopProducts(topProducts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      // Ensure isLoading is set to false after data fetch attempt
      // This block is implicitly handled by handleRefresh's finally
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchDashboardData();
      toast.success('Dashboard data refreshed successfully!');
    } catch (error) {
      // console.error('Failed to refresh dashboard data:', error);
      // toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleRefresh}
            //className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 w-full md:w-auto"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 w-full md:w-auto"
          >
            Refresh Data
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 min-w-0">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">
              {stats.completedOrders} completed
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 min-w-0">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <div className="flex items-center mt-1 md:mt-2">
              <span className={`text-xs md:text-sm ${
                stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange).toFixed(1)}%
              </span>
              <span className="text-xs md:text-sm text-gray-500 ml-2">
                vs last month
              </span>
            </div>
          </div>
         
          {/* Removed Average Order Value */}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md min-w-0">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Revenue Trend</h2>
            <div className="h-64 md:h-80">
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md min-w-0">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Order Status Distribution</h2>
            <div className="h-64 md:h-80">
              <Pie
                data={orderStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.amount.toLocaleString()}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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

        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard; 