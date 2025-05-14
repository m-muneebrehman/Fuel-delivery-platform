import React, { useState, useEffect } from "react";
import { ShoppingBag, Package, Settings, Filter, ArrowDown, ArrowUp, Edit, Trash, Plus, Clock, X, Check, Loader } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle auth errors and redirect to login if needed
  const handleAuthError = (err) => {
    if (err.response && (err.response.status === 401 || err.response.data?.message === "Token has expired")) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      alert('Your session has expired. Please log in again.');
      navigate('/auth/petrol-owner/login');
      return true;
    }
    return false;
  };

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
      if (!handleAuthError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/fuelpumps/myDeliveryBoys`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setDeliveryBoys(response.data.data);
      } else {
        console.error('Failed to fetch delivery boys');
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        console.error('Error fetching delivery boys:', err);
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setSelectedDeliveryBoy(null);
    fetchDeliveryBoys();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setSelectedDeliveryBoy(null);
  };

  const handleSelectDeliveryBoy = (deliveryBoy) => {
    setSelectedDeliveryBoy(deliveryBoy);
  };

  const assignDeliveryBoy = async () => {
    if (!selectedDeliveryBoy || !selectedOrder) return;
    
    try {
      setAssignLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/fuel-orders/${selectedOrder._id}/assign-delivery`, 
        { deliveryBoyId: selectedDeliveryBoy._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the order in the state
        const updatedOrders = orders.map(order => {
          if (order._id === selectedOrder._id) {
            return {
              ...order,
              deliveryBoy: selectedDeliveryBoy,
              orderStatus: 'assigned'
            };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        closeModal();
        
        // Show success message
        alert('Delivery boy assigned successfully!');
      } else {
        alert('Failed to assign delivery boy');
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        console.log(err.response?.data?.message);
        alert(err.response?.data?.message || 'Failed to assign delivery boy');
      }
    } finally {
      setAssignLoading(false);
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
      case "assigned":
        bgColor = "bg-purple-100";
        textColor = "text-purple-800";
        break;
      case "in-transit":
        bgColor = "bg-indigo-100";
        textColor = "text-indigo-800";
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
                      <button 
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition duration-200"
                        onClick={() => handleViewOrder(order)}
                      >
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

      {/* Delivery Boy Assignment Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-4)} - Assign Delivery Boy
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4 bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-2">Order Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Quantity:</div>
                  <div className="font-medium">{selectedOrder.quantity} L</div>
                  <div className="text-gray-500">Total Amount:</div>
                  <div className="font-medium">${selectedOrder.totalAmount.toFixed(2)}</div>
                  <div className="text-gray-500">Status:</div>
                  <div><StatusBadge status={selectedOrder.orderStatus} /></div>
                  <div className="text-gray-500">Created At:</div>
                  <div className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-2">Available Delivery Boys</h4>
              {deliveryBoys.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No delivery boys available
                </div>
              ) : (
                <div className="grid gap-2 mb-4 max-h-64 overflow-y-auto">
                  {deliveryBoys.map((boy) => (
                    <div 
                      key={boy._id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedDeliveryBoy?._id === boy._id 
                          ? 'border-red-500 bg-red-50' 
                          : 'hover:border-red-300'
                      }`}
                      onClick={() => handleSelectDeliveryBoy(boy)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{boy.fullName}</div>
                          <div className="text-sm text-gray-500">{boy.phoneNumber}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            boy.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {boy.status}
                          </span>
                        </div>
                        {selectedDeliveryBoy?._id === boy._id && (
                          <div className="text-red-500">
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={assignDeliveryBoy}
                  disabled={!selectedDeliveryBoy || assignLoading}
                  className={`px-4 py-2 rounded-md text-white ${
                    !selectedDeliveryBoy || assignLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {assignLoading ? (
                    <div className="flex items-center">
                      <Loader size={16} className="animate-spin mr-2" />
                      Assigning...
                    </div>
                  ) : (
                    'Assign Delivery Boy'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
