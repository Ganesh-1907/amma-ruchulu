import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import adminApi from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders on component mount and set up polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.orders.getAll();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      const response = await adminApi.orders.updateStatus(orderId, newStatus);

      if (response.data) {
        // Update local state with the updated order from the response
        setOrders(
          orders.map((order) =>
            order._id === orderId ? response.data.order : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await adminApi.orders.updateStatus(orderId, "cancelled");

      if (response.data) {
        // Update local state with the updated order from the response
        setOrders(
          orders.map((order) =>
            order._id === orderId ? response.data.order : order
          )
        );
        toast.success("Order cancelled successfully");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
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
    <div className="p-4 bg-gray-50 min-h-screen pb-20 md:pb-6">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-3xl font-bold">Orders Management</h1> */}
        <h1 className="text-xl md:text-3xl font-bold text-black-500">Orders Management</h1>

        <button
          onClick={fetchOrders}
          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-3 text-center text-gray-500 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(
                          order.status
                        )}`}
                        disabled={
                          isUpdating ||
                          order.status === "cancelled" ||
                          order.status === "delivered"
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                      {formatDate(order.deliveryDate)} at{" "}
                      {formatTime(order.deliveryTime)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2 text-[10px]"
                      >
                        View Details
                      </button>
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-600 hover:text-red-900 text-[10px]"
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-3">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <h3 className="font-semibold text-sm">Order Information</h3>
                <p className="text-xs">Order ID: #{selectedOrder._id.slice(-6)}</p>
                <p className="text-xs">Customer: {selectedOrder.user?.name || "N/A"}</p>
                <p className="text-xs">Email: {selectedOrder.user?.email || "N/A"}</p>
                <p className="text-xs">Phone: {selectedOrder.user?.phone || "N/A"}</p>
                <p className="text-xs">Order Date: {formatDate(selectedOrder.createdAt)}</p>
                <p className="text-xs">Delivery Date: {formatDate(selectedOrder.deliveryDate)}</p>
                <p className="text-xs">Delivery Time: {formatTime(selectedOrder.deliveryTime)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Delivery Information</h3>
                <p className="text-xs">
                  Status:{" "}
                  <span
                    className={`px-1 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-1 py-0.5 rounded text-[10px] ${
                    selectedOrder.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {selectedOrder.users&& (
                  <>
                    <p className="text-xs">Driver: {selectedOrder.driver?.name || "N/A"}</p>
                    <p className="text-xs">Driver Phone: {selectedOrder.driver?.phone || "N/A"}</p>
                  </>
                )}
                <p className="text-xs">
                  Address: {selectedOrder.deliveryAddress?.street},{" "}
                  {selectedOrder.deliveryAddress?.city},{" "}
                  {selectedOrder.deliveryAddress?.state} -{" "}
                  {selectedOrder.deliveryAddress?.pincode}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <h3 className="font-semibold text-sm mb-1.5">Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Product</th>
                      <th className="text-left py-1">Quantity</th>
                      <th className="text-left py-1">Price</th>
                      <th className="text-left py-1">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-1">{item.product?.name || "N/A"}</td>
                        <td className="py-1">{item.quantity}</td>
                        <td className="py-1">₹{item.price}</td>
                        <td className="py-1">₹{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right font-semibold py-1">
                        Total Amount:
                      </td>
                      <td className="font-semibold py-1">
                        ₹{selectedOrder.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {selectedOrder.notes && (
              <div className="mb-3">
                <h3 className="font-semibold text-sm">Notes</h3>
                <p className="text-gray-600 text-xs">{selectedOrder.notes}</p>
              </div>
            )}
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
