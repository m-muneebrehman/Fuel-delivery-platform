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
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isLoadingPumps, setIsLoadingPumps] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [pumpId, setPumpId] = useState(0);

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

  const pumpSelected = (pumpId, pumpAddress) => {
    setAddress(pumpAddress);
    setPumpId(pumpId);
    console.log(pumpAddress);
    console.log(pumpId);
  };

  // Handle order creation
  const createOrder = async () => {
    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      // Validate required fields
      if (!selectedLocation || !address || !fuelType || !quantity) {
        throw new Error("Please fill in all required fields");
      }

      // Prepare order data
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

      // Create new order object with response data
      const newOrder = {
        id: data.data._id,
        status: data.data.orderStatus,
        createdAt: data.data.createdAt,
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
        driver: data.data.deliveryBoy
          ? {
              name: data.data.deliveryBoy.name,
              phone: data.data.deliveryBoy.phone,
              rating: data.data.deliveryBoy.rating || 4.5,
              vehicle: data.data.deliveryBoy.vehicle || "Toyota Hilux",
            }
          : null,
        tracking: {
          currentLocation: {
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
          },
          destination: {
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
          },
          progress: 0,
        },
        fuelType: data.data.fuelType,
        quantity: data.data.quantity,
        price: data.data.totalAmount - data.data.deliveryFare,
        deliveryFee: data.data.deliveryFare,
        address: data.data.deliveryAddress.address,
      };

      // Add to orders list
      setOrders([newOrder, ...orders]);
      setCurrentOrder(newOrder);

      // Start tracking
      setShowTracking(true);

      // Show success message
      alert(`Your fuel order #${newOrder.id} has been placed successfully!`);
    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError(error.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Update tracking progress
  useEffect(() => {
    if (!currentOrder) return;

    const interval = setInterval(() => {
      setCurrentOrder((prev) => {
        if (!prev) return null;

        // Update progress
        const newProgress = Math.min(100, (prev.tracking?.progress || 0) + 1);

        // Update status based on progress
        let status = prev.status;
        if (newProgress >= 100) {
          status = "delivered";
          clearInterval(interval);
        } else if (newProgress >= 80) {
          status = "arriving";
        } else if (newProgress >= 20) {
          status = "in-transit";
        } else {
          status = "preparing";
        }

        return {
          ...prev,
          status,
          tracking: {
            ...prev.tracking,
            progress: newProgress,
          },
        };
      });
    }, 1000); // Update every second for demo purposes

    return () => clearInterval(interval);
  }, [currentOrder]);

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
          throw new Error(
            "Please select a valid location from the suggestions"
          );
        }

        const location = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        setAddress(place.formatted_address);

        // Fetch nearby fuel pumps
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/fuel-orders/nearby-pumps?location=${JSON.stringify(
            location
          )}&radius=10000`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();

        console.log(data);

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch nearby fuel pumps");
        }
        console.log(data.data);
        setNearbyPumps(data.data);
      } catch (error) {
        console.error("Error:", error);
        setSearchError(error.message);
        setNearbyPumps([]);
      } finally {
        setIsLoadingPumps(false);
      }
    }
  };

  // Step 3: Payment Method
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
          <div className="flex justify-between py-2 border-t border-gray-200">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              Rs.{" "}
              {(fuelType === "Regular"
                ? 272.89 * quantity
                : fuelType === "Diesel"
                ? 278.91 * quantity
                : 210.3 * quantity
              ).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">Rs. 150.00</span>
          </div>
          <div className="flex justify-between py-2 border-t border-b border-gray-200">
            <span className="font-bold">Total</span>
            <span className="font-bold text-red-600">
              Rs.{" "}
              {(
                (fuelType === "Regular"
                  ? 272.89 * quantity
                  : fuelType === "Diesel"
                  ? 278.91 * quantity
                  : 210.3 * quantity) + 150
              ).toFixed(2)}
            </span>
          </div>
        </div>

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
            disabled={isCreatingOrder}
            className={`py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center ${
              isCreatingOrder ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCreatingOrder ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Order...
              </>
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

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  const handleGoogleMapsLoad = () => {
    setIsGoogleMapsLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
        onLoad={handleGoogleMapsLoad}
      >
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
                      src="/api/placeholder/640/320"
                      alt="Fuel delivery truck"
                      className="w-full h-full object-cover"
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

                {/* Step 1: Fuel Selection */}
                {activeStep === 1 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-4">
                      Select Fuel Type & Quantity
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {["Regular", "Diesel", "Premium"].map((fuel) => (
                        <div
                          key={fuel}
                          className={`border rounded-lg p-4 cursor-pointer transition ${
                            fuelType === fuel
                              ? "border-red-600 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setFuelType(fuel)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Fuel
                                size={20}
                                className={`mr-2 ${
                                  fuelType === fuel
                                    ? "text-red-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="font-medium">{fuel}</span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border ${
                                fuelType === fuel
                                  ? "border-red-600 bg-red-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {fuelType === fuel && (
                                <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Current Price: Rs.{" "}
                            {fuel === "Regular"
                              ? "272.89"
                              : fuel === "Diesel"
                              ? "278.91"
                              : "210.30"}
                            /liter
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <label className="block font-medium text-gray-700 mb-2">
                        Quantity (Liters)
                      </label>
                      <div className="flex items-center">
                        <button
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition"
                          onClick={() => setQuantity(Math.max(5, quantity - 5))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(
                                5,
                                Math.min(100, parseInt(e.target.value) || 5)
                              )
                            )
                          }
                          className="w-20 text-center border-y py-2 focus:outline-none"
                        />
                        <button
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition"
                          onClick={() =>
                            setQuantity(Math.min(100, quantity + 5))
                          }
                        >
                          +
                        </button>
                        <span className="ml-2 text-gray-600">liters</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Min: 5 liters | Max: 100 liters
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          Rs.{" "}
                          {(fuelType === "Regular"
                            ? 272.89 * quantity
                            : fuelType === "Diesel"
                            ? 278.91 * quantity
                            : 210.3 * quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">Rs. 150.00</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-b border-gray-200">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-red-600">
                          Rs.{" "}
                          {(
                            (fuelType === "Regular"
                              ? 272.89 * quantity
                              : fuelType === "Diesel"
                              ? 278.91 * quantity
                              : 210.3 * quantity) + 150
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => setActiveStep(2)}
                        className="py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
                      >
                        Continue
                        <ChevronRight size={20} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Delivery Location */}
                {activeStep === 2 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-4">
                      Delivery Location
                    </h3>

                    <div className="mb-6">
                      <label className="block font-medium text-gray-700 mb-2">
                        Search Location
                      </label>
                      <div className="relative">
                        {isGoogleMapsLoaded ? (
                          <Autocomplete
                            onLoad={setSearchBox}
                            onPlaceChanged={onPlaceSelected}
                          >
                            <input
                              type="text"
                              placeholder="Enter your delivery location"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </Autocomplete>
                        ) : (
                          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                            Loading location search...
                          </div>
                        )}
                      </div>
                      {searchError && (
                        <p className="mt-2 text-sm text-red-600">
                          {searchError}
                        </p>
                      )}
                    </div>

                    {selectedLocation && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Nearby Fuel Pumps
                        </h4>
                        {isLoadingPumps ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">
                              Finding nearby fuel pumps...
                            </p>
                          </div>
                        ) : nearbyPumps.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {nearbyPumps.map((pump) => (
                              <div
                                key={pump._id}
                                className={`border rounded-lg p-4 cursor-pointer transition ${
                                  pump._id === pumpId
                                    ? "border-red-600 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => pumpSelected(pump._id, pump.location.address)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center">
                                    <MapPin
                                      size={18}
                                      className={`mr-2 ${
                                        address === pump.address
                                          ? "text-red-600"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span className="font-medium">
                                      {pump.name || "Fuel Station"}
                                    </span>
                                  </div>
                                  <div
                                    className={`w-4 h-4 rounded-full border ${
                                      address === pump.address
                                        ? "border-red-600 bg-red-600"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {pumpId === pump._id && (
                                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {pump.location.address}
                                </p>
                                
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">
                              No fuel pumps found within 5km radius
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Delivery Notes
                      </h4>
                      <textarea
                        placeholder="Any special instructions for delivery driver?"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          Rs.{" "}
                          {(fuelType === "Regular"
                            ? 272.89 * quantity
                            : fuelType === "Diesel"
                            ? 278.91 * quantity
                            : 210.3 * quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">Rs. 150.00</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-b border-gray-200">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-red-600">
                          Rs.{" "}
                          {(
                            (fuelType === "Regular"
                              ? 272.89 * quantity
                              : fuelType === "Diesel"
                              ? 278.91 * quantity
                              : 210.3 * quantity) + 150
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setActiveStep(1)}
                        className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition flex items-center"
                      >
                        <ChevronLeft size={20} className="mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setActiveStep(3)}
                        className="py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
                      >
                        Continue
                        <ChevronRight size={20} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {activeStep === 3 && renderPaymentStep()}
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
