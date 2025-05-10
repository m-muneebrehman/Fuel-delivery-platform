import React from "react";
import { useState } from 'react';
import { ShoppingBag, Package, Settings, Filter, ArrowDown, ArrowUp, Edit, Trash, Plus, Clock } from 'lucide-react';
;
// Dummy data for orders
const orderData = [
  {
    id: 1,
    customer: "John Doe",
    items: 3,
    total: "$89.99",
    status: "Delivered",
    date: "2025-04-14",
  },
  {
    id: 2,
    customer: "Sarah Williams",
    items: 1,
    total: "$24.50",
    status: "Pending",
    date: "2025-04-15",
  },
  {
    id: 3,
    customer: "Michael Brown",
    items: 5,
    total: "$127.75",
    status: "Processing",
    date: "2025-04-15",
  },
  {
    id: 4,
    customer: "Emily Johnson",
    items: 2,
    total: "$56.00",
    status: "Delivered",
    date: "2025-04-13",
  },
  {
    id: 5,
    customer: "Robert Wilson",
    items: 4,
    total: "$95.25",
    status: "Canceled",
    date: "2025-04-12",
  },
];
function Orders() {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // Sorting function for orders
  const sortedOrders = [...orderData].sort((a, b) => {
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
      case "Delivered":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "Processing":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "Canceled":
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
        {status}
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
                    onClick={() => requestSort("id")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Order ID
                      <SortIcon column="id" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("customer")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden md:table-cell"
                  >
                    <div className="flex items-center">
                      Customer
                      <SortIcon
                        column="customer"
                        currentSortConfig={sortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("items")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden sm:table-cell"
                  >
                    <div className="flex items-center">
                      Items
                      <SortIcon column="items" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("total")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Total
                      <SortIcon column="total" currentSortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("status")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon
                        column="status"
                        currentSortConfig={sortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("date")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition duration-200 hidden lg:table-cell"
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon column="date" currentSortConfig={sortConfig} />
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
                    key={order.id}
                    className={`hover:bg-red-50 transition duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-red-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {order.date}
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
            Showing {orderData.length} orders
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
