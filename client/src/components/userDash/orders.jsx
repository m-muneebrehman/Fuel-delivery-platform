import { useState, useEffect } from "react";
import { Search, Filter, Clock, Truck, Check, X, ChevronDown } from "lucide-react";
import { Navbar } from "./Navbar";

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock size={16} />,
          label: "Pending",
          className: "bg-amber-100 text-amber-700",
        };
      case "confirmed":
        return {
          icon: <Check size={16} />,
          label: "Confirmed",
          className: "bg-blue-100 text-blue-700",
        };
      case "processing":
        return {
          icon: <Truck size={16} />,
          label: "Processing",
          className: "bg-blue-100 text-blue-700",
        };
      case "in-transit":
        return {
          icon: <Truck size={16} />,
          label: "In Transit",
          className: "bg-purple-100 text-purple-700",
        };
      case "delivered":
        return {
          icon: <Check size={16} />,
          label: "Delivered",
          className: "bg-green-100 text-green-700",
        };
      case "cancelled":
        return {
          icon: <X size={16} />,
          label: "Cancelled",
          className: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: <Clock size={16} />,
          label: "Unknown",
          className: "bg-gray-100 text-gray-700",
        };
    }
  };

  const { icon, label, className } = getStatusInfo();

  return (
    <div
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

// Order card component
const OrderCard = ({ order, isExpanded, onToggle }) => {
  // Format delivery date
  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
  const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "N/A";
  
  // Format payment method to be more readable
  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    
    const methodMap = {
      "credit-card": "Credit Card",
      "debit-card": "Debit Card",
      "upi": "UPI",
      "net-banking": "Net Banking"
    };
    
    return methodMap[method] || method;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div
        className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1">
          <div className="flex flex-col">
            <span className="font-medium">{order._id}</span>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>

          <div className="flex-1">
            <div className="text-sm">
              {order.items && order.items.map((item, idx) => (
                <span key={idx} className="mr-2">
                  {item.name}
                  {idx < order.items.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <span className="font-medium">${order.totalAmount?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <StatusBadge status={order.status} />
          <ChevronDown
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            size={20}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <div className="text-sm">
            <h4 className="font-medium mb-2">Order Details</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p>{formattedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p>{formatPaymentMethod(order.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-gray-500">Delivery Date</p>
                  <p>{deliveryDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Delivery Time</p>
                  <p>{order.deliveryTimeSlot ? `${order.deliveryTimeSlot.start} - ${order.deliveryTimeSlot.end}` : "N/A"}</p>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="mt-2">
                  <p className="text-gray-500">Delivery Address</p>
                  <p>
                    {[
                      order.deliveryAddress.street,
                      order.deliveryAddress.city,
                      order.deliveryAddress.state,
                      order.deliveryAddress.zipCode
                    ].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-gray-500 mb-2">Items</p>
                <div className="border rounded-md divide-y">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="p-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded w-10 h-10 flex items-center justify-center text-gray-500">
                          {item.quantity}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        ${item.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-right">
                <span className="text-gray-500">Total</span>
                <p className="text-lg font-semibold">
                  ${order.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
              
              {order.notes && (
                <div className="mt-4">
                  <p className="text-gray-500">Notes</p>
                  <p className="italic">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        
        if (!userId) {
          setError("User not logged in")
          setLoading(false);
          return;
        }
        
        const response = await fetch(`http://localhost:5000/orders/getOrders?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched orders data:", typeof data, data);
        setOrders(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.items && order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Toggle expanded state of an order
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen my-33">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

          {/* Search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isExpanded={expandedOrderId === order._id}
                  onToggle={() => toggleOrderExpanded(order._id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}