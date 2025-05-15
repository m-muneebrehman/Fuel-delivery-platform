import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Fuel,
  CreditCard,
  Navigation,
  Check,
  X,
  Home,
  Menu,
} from "lucide-react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function FuelDeliverySystem() {
  const [activeStep, setActiveStep] = useState(1);
  const [quantity, setQuantity] = useState(10);
  const [fuelType, setFuelType] = useState("Regular");
  const [address, setAddress] = useState("");
  const [showTracking, setShowTracking] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [nearbyPumps, setNearbyPumps] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
  const [selectedPumpCoordinates, setSelectedPumpCoordinates] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isLoadingPumps, setIsLoadingPumps] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [pumpId, setPumpId] = useState(0);
  const [fuelPrices, setFuelPrices] = useState({
    Regular: { pricePerLiter: 0 },
    Diesel: { pricePerLiter: 0 },
    Premium: { pricePerLiter: 0 }
  });
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState(null);
  const DELIVERY_FEE = 150; // Fixed delivery fee
  const [selectedPumpAddress, setSelectedPumpAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(150); // Default value
  const [isCalculatingFare, setIsCalculatingFare] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const navigate = useNavigate();

  // Dummy delivery locations in Islamabad
  const locations = [
    {
      id: 1,
      name: "F-8 Markaz",
      address: "123 Jinnah Avenue, F-8 Markaz, Islamabad",
    },
    { id: 2, name: "Blue Area", address: "45 Blue Area, Islamabad" },
    {
      id: 3,
      name: "I-8 Markaz",
      address: "78 Main Commercial, I-8 Markaz, Islamabad",
    },
    { id: 4, name: "Home Address", address: "Default Home Address, Islamabad" },
  ];

  // Dummy order data
  const dummyOrderData = {
    id: "FD" + Math.floor(10000 + Math.random() * 90000),
    status: "in-transit",
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
    driver: {
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      rating: 4.8,
      vehicle: "Toyota Hilux - ICT-123",
    },
    tracking: {
      currentLocation: {
        lat: 33.6844,
        lng: 73.0479,
      },
      destination: {
        lat: 33.7294,
        lng: 73.0931,
      },
      progress: 0,
    },
    fuelType: fuelType,
    quantity: quantity,
    price:
      fuelType === "Regular" ? 272.89 : fuelType === "Diesel" ? 278.91 : 210.3,
    deliveryFee: 150,
    address: address || locations[0].address,
  };

  const pumpSelected = (pumpId, pumpAddress, pumpCoordinates) => {
    setPumpId(pumpId);
    setSelectedPumpAddress(pumpAddress);
    setSelectedPumpCoordinates(pumpCoordinates);
    console.log("Selected pump address:", pumpAddress);
    console.log("Selected pump coordinates:", pumpCoordinates);
    console.log("Selected pump ID:", pumpId);
  };

  // Fetch fuel prices
  const fetchPrices = async () => {
    setLoadingPrices(true);
    try {
      // Use a fallback URL if the environment variable isn't available
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Fetching fuel prices from:', `${apiUrl}/fuel-prices`);
      
      const response = await fetch(`${apiUrl}/fuel-prices`);
      if (!response.ok) {
        throw new Error(`Failed to fetch fuel prices: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different API response formats
      if (data.success && Array.isArray(data.data)) {
        console.log('Setting prices from data.data:', data.data);
        setFuelPrices(data.data.reduce((acc, price) => ({
          ...acc,
          [price.fuelType]: { pricePerLiter: price.pricePerLiter }
        }), {}));
        
        // Initialize edit values
        const initialEditValues = {};
        data.data.forEach(price => {
          initialEditValues[price.fuelType] = {
            pricePerLiter: price.pricePerLiter
          };
        });
        setPriceError(null);
      } 
      // If the API returns an array directly
      else if (Array.isArray(data)) {
        console.log('Setting prices from direct array:', data);
        setFuelPrices(data.reduce((acc, price) => ({
          ...acc,
          [price.fuelType]: { pricePerLiter: price.pricePerLiter }
        }), {}));
        
        // Initialize edit values
        const initialEditValues = {};
        data.forEach(price => {
          initialEditValues[price.fuelType] = {
            pricePerLiter: price.pricePerLiter
          };
        });
        setPriceError(null);
      }
      else {
        throw new Error(data.message || 'Failed to fetch fuel prices - unexpected response format');
      }
    } catch (err) {
      setPriceError('Error loading fuel prices: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoadingPrices(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Get current fuel price based on selected fuel type
  const getCurrentFuelPrice = () => {
    return fuelPrices[fuelType]?.pricePerLiter || 0;
  };

  // Calculate delivery fee when location is selected
  const calculateDeliveryFare = async () => {
    if (deliveryCoordinates && selectedPumpCoordinates) {
      try {
        setIsCalculatingFare(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/maps/calculate-fare`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            origin: selectedPumpCoordinates,
            destination: deliveryCoordinates
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to calculate delivery fare');
        }

        const data = await response.json();
        if (data.success) {
          setDeliveryFee(data.data.fare);
        } else {
          throw new Error(data.message || 'Failed to calculate delivery fare');
        }
      } catch (error) {
        console.error('Error calculating delivery fare:', error);
        toast.error('Failed to calculate delivery fee. Using default fee.');
        setDeliveryFee(150);
      } finally {
        setIsCalculatingFare(false);
      }
    }
  };

  // Call calculateDeliveryFare when coordinates change
  useEffect(() => {
    calculateDeliveryFare();
  }, [deliveryCoordinates, selectedPumpCoordinates]);

  // Get delivery fee
  const getDeliveryFee = () => {
    return deliveryFee;
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    const price = getCurrentFuelPrice();
    return price * quantity;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryFee();
  };

  // Add polling interval for order tracking
  useEffect(() => {
    let pollInterval;
    
    if (currentOrder && currentOrder.status !== 'delivered') {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/fuel-orders/${currentOrder.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch order status');
          }
          
          const data = await response.json();
          
          if (data.success) {
            setCurrentOrder(prevOrder => ({
              ...prevOrder,
              status: data.data.orderStatus,
              tracking: {
                ...prevOrder.tracking,
                progress: data.data.progress || prevOrder.tracking.progress,
              },
              driver: data.data.deliveryBoy ? {
                name: data.data.deliveryBoy.name,
                phone: data.data.deliveryBoy.phone,
                rating: data.data.deliveryBoy.rating || 4.5,
                vehicle: data.data.deliveryBoy.vehicle || "Toyota Hilux",
              } : prevOrder.driver,
            }));
            
            // If order is delivered, clear the interval
            if (data.data.orderStatus === 'delivered') {
              clearInterval(pollInterval);
            }
          }
        } catch (error) {
          console.error('Error polling order status:', error);
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [currentOrder]);

  // Add this function to check order status
  const checkOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fuel-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }

      const data = await response.json();
      if (data.success) {
        setOrderStatus(data.data.orderStatus);
        
        // If order is delivered or cancelled, clear the interval
        if (data.data.orderStatus === 'delivered' || data.data.orderStatus === 'cancelled') {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
      }
    } catch (error) {
      console.error('Error checking order status:', error);
    }
  };

  // Modify the createOrder function
  const createOrder = async () => {
    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      // Validate required fields
      if (!selectedLocation || !address || !fuelType || !quantity) {
        throw new Error("Please fill in all required fields");
      }

      // Get current prices
      const currentPrice = getCurrentFuelPrice();
      const deliveryFee = getDeliveryFee();
      
      // Prepare order data with current prices
      const orderData = {
        fuelPump: pumpId,
        fuelType,
        quantity,
        deliveryAddress: {
          coordinates: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          },
          address: address,
        },
        paymentMethod,
        fuelPrice: currentPrice,
        deliveryFee: deliveryFee
      };

      // Make API call to create order
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/fuel-orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Show success message
      toast.success(`Your fuel order #${data.data._id} has been placed successfully!`);

      // Set current order and show tracking
      const newOrder = {
        id: data.data._id,
        status: data.data.orderStatus || 'pending',
        createdAt: data.data.createdAt,
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
        tracking: {
          progress: 0,
        },
        fuelType: data.data.fuelType,
        quantity: data.data.quantity,
        price: data.data.fuelPrice,
        deliveryFee: data.data.deliveryFee,
        address: data.data.deliveryAddress.address,
      };

      setCurrentOrder(newOrder);
      setIsOrderPlaced(true);
      setIsCreatingOrder(false);
    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError(error.message);
      toast.error(error.message);
      setIsCreatingOrder(false);
    }
  };

  // Add cleanup for interval
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Add loading screen component
  const OrderLoadingScreen = () => (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Order</h2>
        <p className="text-gray-600 mb-4">Please wait while we confirm your order...</p>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modify the OrderStatusScreen component
  const OrderStatusScreen = () => {
    const [status, setStatus] = useState(currentOrder?.status || 'pending');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!currentOrder?.id) {
        setError('No order found');
        setIsLoading(false);
        return;
      }

      const checkStatus = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/fuel-orders/${currentOrder.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch status');
          }

          const data = await response.json();
          if (data.success) {
            setStatus(data.data.orderStatus);
            setError(null);
          }
        } catch (error) {
          console.error('Error checking status:', error);
          setError('Failed to fetch order status');
        } finally {
          setIsLoading(false);
        }
      };

      // Check status immediately
      checkStatus();

      // Set up interval to check every 10 seconds
      const interval = setInterval(checkStatus, 10000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }, [currentOrder?.id]);

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

    if (isLoading) {
      return (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Order Status</h2>
              <p className="text-gray-600">Please wait while we fetch your order details...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button
              onClick={() => {
                setIsOrderPlaced(false);
                setShowTracking(false);
              }}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Back to Order
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Status</h2>
            <p className="text-gray-600">
              {getStatusMessage(status)}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">{currentOrder.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>

          {status === 'delivered' || status === 'cancelled' ? (
            <button
              onClick={() => {
                setIsOrderPlaced(false);
                setShowTracking(true);
              }}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              View Order Details
            </button>
          ) : (
            <div className="mt-6">
              <div className="animate-pulse text-sm text-gray-500">
                Checking status...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Generate order status description
  const getStatusDescription = (status) => {
    switch (status) {
      case "preparing":
        return "Your fuel is being prepared for delivery";
      case "in-transit":
        return "Your fuel is on the way to your location";
      case "arriving":
        return "Your delivery driver is arriving soon";
      case "delivered":
        return "Your fuel has been delivered successfully";
      default:
        return "Processing your order";
    }
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate remaining time in minutes
  const getRemainingTime = () => {
    if (!currentOrder) return "0 mins";

    const estimatedDelivery = new Date(currentOrder.estimatedDelivery);
    const now = new Date();
    const diffMs = estimatedDelivery - now;
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));

    return `${diffMins} min${diffMins !== 1 ? "s" : ""}`;
  };

  // Handle location selection from Google Places
  const onPlaceSelected = async () => {
    if (searchBox) {
      try {
        setSearchError(null);
        setIsLoadingPumps(true);
        const place = searchBox.getPlace();

        if (!place.geometry) {
          throw new Error("Please select a valid location from the suggestions");
        }

        const location = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        setDeliveryCoordinates(location);
        setAddress(place.formatted_address);

        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        // Fetch nearby fuel pumps with authorization header
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/fuel-orders/nearby-pumps?location=${JSON.stringify(
            location
          )}&radius=10000`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch nearby pumps');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch nearby fuel pumps');
        }
        setNearbyPumps(data.data);
      } catch (error) {
        console.error("Error:", error);
        setSearchError(error.message);
        setNearbyPumps([]);
        toast.error(error.message);
      } finally {
        setIsLoadingPumps(false);
      }
    }
  };

  // Skeleton loading component
  const PriceSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  // Skeleton loading component for the entire form
  const FormSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
      
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Update the payment step render function to show skeleton loading for price calculations
  const renderPaymentStep = () => {
    return (
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">
          Select Payment Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition ${
              paymentMethod === "card"
                ? "border-red-600 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CreditCard
                  size={20}
                  className={`mr-2 ${
                    paymentMethod === "card" ? "text-red-600" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border ${
                  paymentMethod === "card"
                    ? "border-red-600 bg-red-600"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "card" && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Pay securely with your credit or debit card
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition ${
              paymentMethod === "cash"
                ? "border-red-600 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPaymentMethod("cash")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Home
                  size={20}
                  className={`mr-2 ${
                    paymentMethod === "cash" ? "text-red-600" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border ${
                  paymentMethod === "cash"
                    ? "border-red-600 bg-red-600"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "cash" && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Pay with cash when your fuel is delivered
            </div>
          </div>
        </div>

        <div className="mt-8">
          {loadingPrices || isCalculatingFare ? (
            // Skeleton loading for price breakdown
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            // Actual price breakdown
            <>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-gray-600">Fuel Price</span>
                <span className="font-medium">Rs. {getCurrentFuelPrice().toFixed(2)}/liter</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{quantity} liters</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">Rs. {getDeliveryFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-b border-gray-200">
                <span className="font-bold">Total</span>
                <span className="font-bold text-red-600">Rs. {calculateTotal().toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {priceError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{priceError}</p>
            <button
              onClick={fetchPrices}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Retry loading prices
            </button>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setActiveStep(2)}
            className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition flex items-center"
            disabled={isCreatingOrder}
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </button>
          <button
            onClick={createOrder}
            disabled={isCreatingOrder || loadingPrices}
            className={`py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center ${
              (isCreatingOrder || loadingPrices) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCreatingOrder ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Order...
              </>
            ) : loadingPrices ? (
              "Loading Prices..."
            ) : (
              <>
                Place Order
                <Check size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>

        {orderError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{orderError}</p>
          </div>
        )}
      </div>
    );
  };

  // Render fuel selection step
  const renderFuelSelection = () => {
    return (
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Select Fuel Type and Quantity</h3>

        {/* Fuel Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Fuel Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Regular', 'Premium', 'Diesel'].map((type) => (
              <div
                key={type}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  fuelType === type
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFuelType(type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Fuel
                      size={20}
                      className={`mr-2 ${
                        fuelType === type ? 'text-red-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-medium">{type}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      fuelType === type
                        ? 'border-red-600 bg-red-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {fuelType === type && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                    )}
                  </div>
                </div>
                {loadingPrices ? (
                  <div className="mt-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="mt-2 text-sm text-gray-600">
                    Rs. {fuelPrices[type]?.pricePerLiter.toFixed(2)}/liter
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Quantity (Liters)
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(5, quantity - 5))}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
              type="button"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <input
              type="number"
              min="5"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(5, parseInt(e.target.value) || 5))}
              className="block w-24 text-center border-gray-200 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
            <button
              onClick={() => setQuantity(quantity + 5)}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
              type="button"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">Minimum order: 5 liters</p>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Price per liter</span>
            <span className="font-medium">
              {loadingPrices ? (
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse inline-block"></div>
              ) : (
                `Rs. ${getCurrentFuelPrice().toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Quantity</span>
            <span className="font-medium">{quantity} liters</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium text-red-600">
              {loadingPrices ? (
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse inline-block"></div>
              ) : (
                `Rs. ${calculateSubtotal().toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end">
          <button
            onClick={() => setActiveStep(2)}
            disabled={loadingPrices}
            className={`py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center ${
              loadingPrices ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next Step
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Render delivery location step
  const renderDeliveryLocation = () => {
    return (
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-4">Select Delivery Location</h3>

        {/* Location Search */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Delivery Address
          </label>
          {isGoogleMapsLoaded ? (
            <Autocomplete
              onLoad={autocomplete => setSearchBox(autocomplete)}
              onPlaceChanged={onPlaceSelected}
            >
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </Autocomplete>
          ) : (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          )}
          {searchError && (
            <p className="mt-2 text-sm text-red-600">{searchError}</p>
          )}
        </div>

        {/* Nearby Fuel Pumps */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Nearby Fuel Pumps</h4>
          {isLoadingPumps ? (
            // Skeleton loading for pumps
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : nearbyPumps.length > 0 ? (
            <div className="space-y-4">
              {nearbyPumps.map((pump) => (
                <div
                  key={pump._id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    pumpId === pump._id
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => pumpSelected(
                    pump._id, 
                    pump.location.address,
                    {
                      latitude: pump.location.coordinates[1],
                      longitude: pump.location.coordinates[0]
                    }
                  )}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h5 className="font-medium text-gray-900">{pump.name}</h5>
                      <p className="text-sm text-gray-500 mt-1">
                        {pump.location.address}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{(pump.distance / 1000).toFixed(1)} km away</span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        pumpId === pump._id
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {pumpId === pump._id && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedLocation ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Fuel className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No fuel pumps found nearby.</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching in a different area
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Enter your delivery address</p>
              <p className="text-sm text-gray-500 mt-1">
                to see nearby fuel pumps
              </p>
            </div>
          )}
        </div>

        {/* Selected Location Summary */}
        {selectedLocation && address && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h5 className="font-medium text-gray-900">Delivery Location</h5>
                <p className="text-sm text-gray-600 mt-1">{address}</p>
                {selectedPumpAddress && (
                  <>
                    <h5 className="font-medium text-gray-900 mt-3">Selected Pump</h5>
                    <p className="text-sm text-gray-600 mt-1">{selectedPumpAddress}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setActiveStep(1)}
            className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition flex items-center"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </button>
          <button
            onClick={() => setActiveStep(3)}
            disabled={!selectedLocation || !address || !pumpId}
            className={`py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center ${
              !selectedLocation || !address || !pumpId
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Next Step
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

        {/* Error Message */}
        {!selectedLocation && (
          <p className="mt-4 text-sm text-red-600">
            Please select a delivery location to continue
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  const handleGoogleMapsLoad = () => {
    setIsGoogleMapsLoaded(true);
  };

  // Fix the LoadScript libraries warning
  const libraries = ["places"];

  return (
    <div className="min-h-screen bg-gray-100">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={handleGoogleMapsLoad}
      >
        {/* Add loading and status screens */}
        {isCreatingOrder && <OrderLoadingScreen />}
        {isOrderPlaced && !isCreatingOrder && currentOrder && <OrderStatusScreen />}
        
        {/* Header */}
        <header className="bg-red-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setShowTracking(false)}
                className={`mr-2 ${showTracking ? "block" : "hidden"}`}
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">FuelExpress</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="hidden md:flex items-center hover:text-red-200"
                onClick={() => setShowTracking(true)}
                disabled={orders.length === 0}
              >
                <Truck size={20} className="mr-1" />
                <span>Track Order</span>
              </button>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-red-700 px-4 py-2">
              <div className="flex flex-col space-y-2 text-white">
                <button
                  className="flex items-center py-2 hover:text-red-200"
                  onClick={() => {
                    setShowTracking(true);
                    setMobileMenuOpen(false);
                  }}
                  disabled={orders.length === 0}
                >
                  <Truck size={20} className="mr-2" />
                  <span>Track Order</span>
                </button>

                <button
                  className="flex items-center py-2 hover:text-red-200"
                  onClick={() => {
                    setShowTracking(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Home size={20} className="mr-2" />
                  <span>Order Fuel</span>
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="container mx-auto px-4 py-8">
          {showTracking ? (
            /* Order Tracking View */
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
              {currentOrder ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Order #{currentOrder.id}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentOrder.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {currentOrder.status === "delivered"
                        ? "Delivered"
                        : "In Progress"}
                    </span>
                  </div>

                  {/* Progress Tracker */}
                  <div className="mb-8">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          currentOrder.status === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${currentOrder.tracking.progress}%` }}
                      ></div>
                    </div>

                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>Order Placed</span>
                      <span>In Transit</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="flex items-start">
                      <div
                        className={`p-3 rounded-full mr-4 ${
                          currentOrder.status === "delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {currentOrder.status === "delivered" ? (
                          <Check size={24} />
                        ) : (
                          <Truck size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {currentOrder.status === "delivered"
                            ? "Fuel Delivered!"
                            : "Fuel Delivery In Progress"}
                        </h3>
                        <p className="text-gray-600">
                          {getStatusDescription(currentOrder.status)}
                        </p>

                        {currentOrder.status !== "delivered" && (
                          <div className="mt-2 flex items-center text-red-600">
                            <Clock size={16} className="mr-1" />
                            <span className="font-medium">
                              Estimated arrival in {getRemainingTime()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details Card */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="font-bold text-gray-800">
                        Delivery Details
                      </h3>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start mb-4">
                        <MapPin
                          size={20}
                          className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            Delivery Location
                          </p>
                          <p className="text-gray-600">
                            {currentOrder.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start mb-4">
                        <Calendar
                          size={20}
                          className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            Order Date & Time
                          </p>
                          <p className="text-gray-600">
                            {new Date(
                              currentOrder.createdAt
                            ).toLocaleDateString()}
                            , {formatTime(currentOrder.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Fuel
                          size={20}
                          className="text-gray-400 mr-3 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            Fuel Details
                          </p>
                          <p className="text-gray-600">
                            {currentOrder.quantity} liters of{" "}
                            {currentOrder.fuelType}
                          </p>
                          <p className="text-gray-600">
                            Rs.{" "}
                            {(
                              currentOrder.price * currentOrder.quantity +
                              currentOrder.deliveryFee
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info Card */}
                  {currentOrder.status !== "delivered" && (
                    <div className="bg-white rounded-lg border border-gray-200 mb-6">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="font-bold text-gray-800">
                          Delivery Partner
                        </h3>
                      </div>

                      <div className="p-4 flex items-center">
                        <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                          <span className="text-2xl font-bold text-gray-500">
                            {currentOrder.driver.name.charAt(0)}
                          </span>
                        </div>

                        <div className="flex-grow">
                          <p className="font-medium text-gray-800">
                            {currentOrder.driver.name}
                          </p>
                          <div className="flex items-center text-gray-600 text-sm">
                            <span className="flex items-center mr-3">
                              ★ {currentOrder.driver.rating}
                            </span>
                            <span>{currentOrder.driver.vehicle}</span>
                          </div>
                        </div>

                        <button className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition">
                          Call Driver
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Map View */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="font-bold text-gray-800">Live Tracking</h3>
                    </div>

                    <div className="h-64 bg-gray-200 relative">
                      <img
                        src="/bg-car.jpg"
                        alt="Map view"
                        className="w-full h-full object-cover"
                      />

                      {/* Origin Point */}
                      <div
                        className="absolute"
                        style={{
                          left: "20%",
                          top: "60%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="bg-blue-500 h-4 w-4 rounded-full border-2 border-white shadow-md"></div>
                      </div>

                      {/* Destination Point */}
                      <div
                        className="absolute"
                        style={{
                          left: "80%",
                          top: "30%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="bg-red-500 h-4 w-4 rounded-full border-2 border-white shadow-md"></div>
                      </div>

                      {/* Vehicle Icon */}
                      <div
                        className="absolute"
                        style={{
                          left: `${
                            20 +
                            (80 - 20) * (currentOrder.tracking.progress / 100)
                          }%`,
                          top: `${
                            60 -
                            (60 - 30) * (currentOrder.tracking.progress / 100)
                          }%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="bg-white p-1 rounded-full shadow-lg">
                          <Truck size={20} className="text-red-600" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          {currentOrder.status === "delivered"
                            ? "Delivery Completed"
                            : `Arrival in ${getRemainingTime()}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentOrder.status === "delivered"
                            ? "Thank you for your order!"
                            : "Driver is on the way"}
                        </p>
                      </div>

                      {currentOrder.status !== "delivered" && (
                        <div className="flex items-center text-red-600">
                          <Navigation size={16} className="mr-1" />
                          <span className="font-medium text-sm">
                            Live Updates
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button
                      onClick={() => setShowTracking(false)}
                      className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <ChevronLeft size={20} className="mr-2" />
                      Back to Ordering
                    </button>

                    {currentOrder.status !== "delivered" && (
                      <button className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center">
                        Support
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mb-4 text-gray-400">
                    <Truck size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Active Orders
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any active fuel delivery orders to track.
                  </p>
                  <button
                    onClick={() => setShowTracking(false)}
                    className="py-2 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Order Fuel Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Order Placement View */
            <div>
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg mb-8 overflow-hidden">
                <div className="md:flex items-center">
                  <div className="p-6 md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">
                      On-Demand Fuel Delivery
                    </h2>
                    <p className="mb-6">
                      Get fuel delivered directly to your vehicle or home
                      storage tank in Islamabad.
                    </p>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Check size={20} className="mr-1" />
                        <span>Quality Assured</span>
                      </div>
                      <div className="flex items-center">
                        <Check size={20} className="mr-1" />
                        <span>Fast Delivery</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 h-64 bg-gray-300">
                    <img
                      src="https://images.unsplash.com/photo-1687203238072-2992045bedff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Car being refueled at a fuel pump"
                      className="w-full h-full object-cover"
                      style={{objectPosition: 'center'}}
                    />
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Fuel
                </h2>

                {/* Steps */}
                <div className="mb-8">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 1
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        activeStep >= 2 ? "bg-red-600" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 2
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        activeStep >= 3 ? "bg-red-600" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 3
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      3
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span
                      className={
                        activeStep === 1 ? "font-medium text-red-600" : ""
                      }
                    >
                      Fuel Selection
                    </span>
                    <span
                      className={
                        activeStep === 2 ? "font-medium text-red-600" : ""
                      }
                    >
                      Delivery Location
                    </span>
                    <span
                      className={
                        activeStep === 3 ? "font-medium text-red-600" : ""
                      }
                    >
                      Payment
                    </span>
                  </div>
                </div>

                {isPageLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    {/* Step 1: Fuel Selection */}
                    {activeStep === 1 && renderFuelSelection()}

                    {/* Step 2: Delivery Location */}
                    {activeStep === 2 && renderDeliveryLocation()}

                    {/* Step 3: Payment */}
                    {activeStep === 3 && renderPaymentStep()}
                  </>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
                      <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Fast Delivery</h3>
                  </div>
                  <p className="text-gray-600">
                    Get fuel delivered to your location in Islamabad within 45
                    minutes.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
                      <Fuel size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">
                      Quality Guaranteed
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    We source our fuel only from authorized dealers to ensure
                    highest quality.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800">Secure Payments</h3>
                  </div>
                  <p className="text-gray-600">
                    Pay securely with your credit/debit card or choose cash on
                    delivery.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12 bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h2>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    How does fuel delivery work?
                  </h3>
                  <p className="text-gray-600">
                    We deliver fuel directly to your location in specialized
                    fuel trucks. Just place an order, and our trained
                    professionals will deliver fuel to your vehicle or storage
                    tank.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    What areas do you serve in Islamabad?
                  </h3>
                  <p className="text-gray-600">
                    We currently serve all major sectors in Islamabad including
                    F sectors, G sectors, I sectors, and Blue Area.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    Is there a minimum order quantity?
                  </h3>
                  <p className="text-gray-600">
                    Yes, our minimum order quantity is 5 liters to ensure
                    delivery efficiency.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">
                    How can I track my fuel delivery?
                  </h3>
                  <p className="text-gray-600">
                    Once your order is confirmed, you can track your delivery in
                    real-time through our app's tracking feature.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </LoadScript>
    </div>
  );
}
