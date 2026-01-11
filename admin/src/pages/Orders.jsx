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

      if (response.data?.order) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? response.data.order : order
          )
        );

        toast.success(`Order marked as ${newStatus}`);
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
        <h1 className="text-xl md:text-3xl font-bold text-black-500">
          Orders Management
        </h1>

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
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900 flex gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md text-sm font-semibold"
                      >
                        View Details
                      </button>

                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-semibold"
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl">

      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Order Details</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-6 text-sm">

        {/* ORDER INFO */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Order Information
          </h3>

          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">#{selectedOrder._id.slice(-6)}</span>

            <span className="text-gray-500">Order Date</span>
            <span>{formatDate(selectedOrder.createdAt)}</span>

            <span className="text-gray-500">Delivery Date</span>
            <span>{formatDate(selectedOrder.deliveryDate)}</span>

            <span className="text-gray-500">Delivery Time</span>
            <span>{formatTime(selectedOrder.deliveryTime)}</span>
          </div>
        </section>

        {/* CUSTOMER INFO */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Customer Details
          </h3>

          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Name</span>
            <span>{selectedOrder.user?.name || "N/A"}</span>

            <span className="text-gray-500">Email</span>
            <span>{selectedOrder.user?.email || "N/A"}</span>

            <span className="text-gray-500">Phone</span>
            <span>{selectedOrder.user?.phone || "N/A"}</span>
          </div>
        </section>

        {/* DELIVERY & PAYMENT */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Delivery & Payment
          </h3>

          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Order Status</span>
            <span
              className={`inline-block w-fit px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                selectedOrder.status
              )}`}
            >
              {getStatusLabel(selectedOrder.status)}
            </span>

            <span className="text-gray-500">Payment Status</span>
            <span
              className={`inline-block w-fit px-2 py-0.5 rounded text-xs font-semibold ${
                selectedOrder.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {selectedOrder.paymentStatus}
            </span>

            <span className="text-gray-500">Payment Method</span>
            <span>{selectedOrder.paymentMethod}</span>
          </div>
        </section>

        {/* ADDRESS */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Delivery Address
          </h3>

          <p className="text-gray-700 leading-relaxed">
            {selectedOrder.address?.street}, <br />
            {selectedOrder.address?.city}, {selectedOrder.address?.state} -{" "}
            {selectedOrder.address?.pincode}
          </p>
        </section>

        {/* PRODUCTS */}
        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
            Ordered Products
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-2 py-1">Product</th>
                  <th className="text-center px-2 py-1">Qty</th>
                  <th className="text-right px-2 py-1">Price</th>
                  <th className="text-right px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-2 py-1">
                      {item.product?.name || item.name}
                    </td>
                    <td className="text-center px-2 py-1">
                      {item.quantity}
                    </td>
                    <td className="text-right px-2 py-1">
                      ₹{item.unitPrice ?? item.price}
                    </td>
                    <td className="text-right px-2 py-1 font-semibold">
                      ₹{item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-3 font-semibold">
            Total: ₹{selectedOrder.totalAmount}
          </div>
        </section>

        {/* NOTES */}
        {selectedOrder.notes && (
          <section className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">
              Notes
            </h3>
            <p className="text-gray-600">{selectedOrder.notes}</p>
          </section>
        )}

      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
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
