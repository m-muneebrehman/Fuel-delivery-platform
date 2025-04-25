import { useState } from "react";
import { Search, Filter, Clock, Truck, Check, ChevronDown } from "lucide-react";
import { Navbar } from "./Navbar";

// Dummy order data
const dummyOrders = [
  {
    id: "ORD-8294",
    date: "2025-04-22",
    items: [{ name: "Wireless Headphones", quantity: 1, price: 129.99 }],
    total: 129.99,
    status: "pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-7632",
    date: "2025-04-20",
    items: [
      { name: "Smart Watch", quantity: 1, price: 249.99 },
      { name: "Watch Band", quantity: 2, price: 24.99 },
    ],
    total: 299.97,
    status: "processing",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-6521",
    date: "2025-04-18",
    items: [{ name: "Bluetooth Speaker", quantity: 1, price: 79.99 }],
    total: 79.99,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-5980",
    date: "2025-04-15",
    items: [
      { name: "Phone Case", quantity: 1, price: 29.99 },
      { name: "Screen Protector", quantity: 2, price: 14.99 },
    ],
    total: 59.97,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-5234",
    date: "2025-04-10",
    items: [
      { name: "Laptop Bag", quantity: 1, price: 69.99 },
      { name: "USB-C Cable", quantity: 2, price: 12.99 },
    ],
    total: 95.97,
    status: "completed",
    paymentMethod: "Apple Pay",
  },
];

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
      case "processing":
        return {
          icon: <Truck size={16} />,
          label: "Processing",
          className: "bg-blue-100 text-blue-700",
        };
      case "completed":
        return {
          icon: <Check size={16} />,
          label: "Completed",
          className: "bg-green-100 text-green-700",
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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div
        className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1">
          <div className="flex flex-col">
            <span className="font-medium">{order.id}</span>
            <span className="text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex-1">
            <div className="text-sm">
              {order.items.map((item, idx) => (
                <span key={idx} className="mr-2">
                  {item.name}
                  {idx < order.items.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <span className="font-medium">${order.total.toFixed(2)}</span>
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
                  <p>{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 mb-2">Items</p>
                <div className="border rounded-md divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded w-10 h-10 flex items-center justify-center text-gray-500">
                          {item.quantity}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-right">
                <span className="text-gray-500">Total</span>
                <p className="text-lg font-semibold">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filter orders based on search term and status
  const filteredOrders = dummyOrders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggle={() => toggleOrderExpanded(order.id)}
                />
              ))
            ) : (
              <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
