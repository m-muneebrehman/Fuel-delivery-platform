import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Fuel } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function DeliveryBoyDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch assigned orders
  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fuel-orders/delivery-boy/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle order selection
  const handleOrderClick = (order) => {
    if (order.orderStatus === 'assigned') {
      if (window.confirm('Are you ready to start this delivery?')) {
        startDelivery(order._id);
      }
    }
  };

  // Start delivery
  const startDelivery = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fuel-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'in-transit' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start delivery');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Delivery started successfully');
        fetchAssignedOrders(); // Refresh orders
      } else {
        throw new Error(data.message || 'Failed to start delivery');
      }
    } catch (error) {
      console.error('Error starting delivery:', error);
      toast.error('Failed to start delivery');
    }
  };

  // Mark order as delivered
  const markOrderAsDelivered = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fuel-orders/${orderId}/mark-delivered`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark order as delivered');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Order marked as delivered');
        fetchAssignedOrders(); // Refresh orders
      } else {
        throw new Error(data.message || 'Failed to mark order as delivered');
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error('Failed to mark order as delivered');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAssignedOrders}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Assigned Orders</h1>
          <button
            onClick={fetchAssignedOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Orders</h3>
            <p className="text-gray-500">You don't have any orders assigned to you at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  order.orderStatus === 'assigned' ? 'hover:bg-blue-50' : ''
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.deliveryAddress.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Fuel className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.quantity} liters of {order.fuelType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Name: {order.user?.userName || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {order.user?.phoneNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {order.orderStatus === 'in-transit' && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        markOrderAsDelivered(order._id);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Mark as Delivered
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;