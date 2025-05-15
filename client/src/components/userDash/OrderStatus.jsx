import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Truck, Clock, MapPin, Fuel } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OrderStatus() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fuel-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch order status');
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch order status');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();

    // Set up interval to check status every 10 seconds
    const interval = setInterval(fetchOrderStatus, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Your order is being processed...';
      case 'assigned':
        return 'A delivery partner has been assigned...';
      case 'in-transit':
        return 'Your fuel is on the way...';
      case 'delivered':
        return 'Your order has been delivered!';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Processing your order...';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Order Status</h2>
          <p className="text-gray-600">Please wait while we fetch your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            <p className="font-medium">{error}</p>
          </div>
          <button
            onClick={fetchOrderStatus}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Order Status</h1>
            <p className="text-red-100">Order #{order?._id?.slice(-6)}</p>
          </div>

          {/* Status Section */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Truck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {getStatusMessage(order?.orderStatus)}
                  </h2>
                  <p className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order?.orderStatus)}`}>
                {order?.orderStatus}
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Delivery Address</p>
                  <p className="text-gray-600">{order?.deliveryAddress?.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Fuel className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Fuel Details</p>
                  <p className="text-gray-600">
                    {order?.quantity} liters of {order?.fuelType}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Order Time</p>
                  <p className="text-gray-600">
                    {new Date(order?.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Dashboard
              </button>
              {order?.orderStatus === 'delivered' && (
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 