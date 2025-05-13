import React, { useState, useEffect } from "react";
import { ShoppingBag, Package, Settings, Filter, ArrowDown, ArrowUp, Edit, Trash, Plus, Clock } from 'lucide-react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/fuel-orders/fuel-pump/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Sorting function for orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Sorting handler for orders
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Order status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";

    switch (status) {
      case "delivered":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "processing":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "cancelled":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Sort icon component
  const SortIcon = ({ column, currentSortConfig }) => {
    if (currentSortConfig.key !== column) {
      return null;
    }
    return currentSortConfig.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Orders Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 text-red-600" size={24} />
            Orders
          </h2>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-red-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th
                    onClick={() => requestSort("_id")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Order ID
                      <SortIcon column="_id" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  {/* <th
                    onClick={() => requestSort("user.name")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden md:table-cell"
                  >
                    <div className="flex items-center">
                      Customer
                      <SortIcon column="user.name" currentSortConfig={sortConfig} />
                    </div>
                  </th> */}
                  <th
                    onClick={() => requestSort("quantity")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden sm:table-cell"
                  >
                    <div className="flex items-center">
                      Quantity
                      <SortIcon column="quantity" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("totalAmount")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Total
                      <SortIcon column="totalAmount" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("orderStatus")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon column="orderStatus" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("createdAt")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden lg:table-cell"
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon column="createdAt" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-100">
                {sortedOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`hover:bg-red-50 transition duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-red-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-4)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {order.user?.name || 'N/A'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      {order.quantity} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="bg-amber-200 text-red-100 hover:text-red-500 mr-3 transition duration-200">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-sm text-gray-700 border-t border-red-100">
            Showing {orders.length} orders
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
