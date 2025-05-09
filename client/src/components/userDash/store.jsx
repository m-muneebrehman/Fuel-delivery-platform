// File: components/SparePartsStore.jsx - Updated version with complete checkout flow
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import Pagination from "./Pagination";
import MobileFilterMenu from "./MobileFilterMenu";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import Swal from "sweetalert2";
import { Filter, X } from "lucide-react";

export default function SparePartsStore() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [compatibleMakes, setCompatibleMakes] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [priceRange, setPriceRange] = useState(200);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Categories list
  const categories = [
    "All",
    "Engine Parts",
    "Brake System",
    "Transmission",
    "Electrical",
    "Suspension",
    "Body Parts",
    "Filters",
    "Other",
  ];

  // Fetch products from the backend with pagination and filters
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    console.log(`Fetching page ${page} with limit ${limit}`);
    try {
      // Build base query parameters
      const params = {
        page,
        limit,
      };

      // Add category filter if not "All"
      if (activeCategory !== "All") {
        params.category = activeCategory;
      }

      // Add price range filter
      if (priceRange) {
        params.maxPrice = priceRange;
      }

      // Construct the URL with URLSearchParams
      const url = new URL('http://localhost:5000/inventory/');
      
      // Add base params
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );
      
      // Add manufacturer filters (multiple values)
      selectedManufacturers.forEach(manufacturer => 
        url.searchParams.append('manufacturer', manufacturer)
      );
      
      // Add vehicle make filters (multiple values)
      selectedMakes.forEach(make => 
        url.searchParams.append('vehicleMake', make)
      );

      console.log("Fetching URL:", url.toString());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fetched inventory data:", result);

      if (result.success) {
        setProducts(result.data);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.pages);
        
        // First-time data setup - extract manufacturers and makes
        if (manufacturers.length === 0) {
          // Extract unique manufacturers
          const uniqueManufacturers = [...new Set(result.data.map(item => item.manufacturer))];
          setManufacturers(uniqueManufacturers);

          // Extract unique compatible vehicle makes if applicable
          if (result.data.length > 0 && result.data[0].compatibleVehicles) {
            const allMakes = result.data.flatMap(item =>
              item.compatibleVehicles.map(vehicle => vehicle.make)
            );
            const uniqueMakes = [...new Set(allMakes)];
            setCompatibleMakes(uniqueMakes);
          }
        }
      } else {
        throw new Error(result.message || "Failed to fetch inventory");
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch when page or filters change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, activeCategory, selectedManufacturers, priceRange, selectedMakes, limit]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setPriceRange(Number(value));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle manufacturer checkbox changes
  const handleManufacturerChange = (manufacturer) => {
    setSelectedManufacturers((prev) => {
      if (prev.includes(manufacturer)) {
        return prev.filter((m) => m !== manufacturer);
      } else {
        return [...prev, manufacturer];
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle vehicle make checkbox changes
  const handleMakeChange = (make) => {
    setSelectedMakes((prev) => {
      if (prev.includes(make)) {
        return prev.filter((m) => m !== make);
      } else {
        return [...prev, make];
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle change in items per page
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Change page - this triggers a new fetch with the updated page number
  const paginate = (pageNumber) => {
    console.log(`Navigating to page ${pageNumber}`);
    setCurrentPage(pageNumber);
  };

  // Enhanced buyNow function with checkout form
  const buyNow = async (product) => {
    // Calculate delivery date (default to 3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    
    // Format date for the input field (YYYY-MM-DD)
    const formattedDate = deliveryDate.toISOString().split('T')[0];
    
    // Show a form to collect delivery and payment information
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Complete Your Purchase',
      html: `
        <div class="text-left">
          <h3 class="text-lg font-semibold mb-2">Product: ${product.name}</h3>
          <p class="mb-4">Price: $${product.price}</p>
          
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <input id="street" class="swal2-input" placeholder="Street Address" required>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <input id="city" class="swal2-input" placeholder="City" required>
              <input id="state" class="swal2-input" placeholder="State" required>
            </div>
            <input id="zipCode" class="swal2-input mt-2" placeholder="Zip Code" required>
          </div>
          
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
            <input id="deliveryDate" type="date" class="swal2-input" value="${formattedDate}" min="${formattedDate}" required>
          </div>
          
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Time Slot</label>
            <select id="timeSlot" class="swal2-input" required>
              <option value="9:00-12:00">Morning (9:00 AM - 12:00 PM)</option>
              <option value="12:00-15:00">Afternoon (12:00 PM - 3:00 PM)</option>
              <option value="15:00-18:00">Evening (3:00 PM - 6:00 PM)</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select id="paymentMethod" class="swal2-input" required>
              <option value="credit-card">Credit Card</option>
              <option value="debit-card">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="net-banking">Net Banking</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
            <textarea id="notes" class="swal2-textarea" placeholder="Any special instructions?"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Place Order',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      focusConfirm: false,
      preConfirm: () => {
        // Validate required fields
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zipCode').value;
        const selectedDate = document.getElementById('deliveryDate').value;
        
        if (!street || !city || !state || !zipCode || !selectedDate) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }
        
        // Return form values
        return {
          deliveryAddress: {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
          },
          deliveryDate: document.getElementById('deliveryDate').value,
          deliveryTimeSlot: document.getElementById('timeSlot').value,
          paymentMethod: document.getElementById('paymentMethod').value,
          notes: document.getElementById('notes').value,
        }
      }
    });

    if (isConfirmed) {
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error('User not logged in');
        }
        
        // Parse the time slot into start and end times
        const [start, end] = formValues.deliveryTimeSlot.split('-');
        
        // Prepare order data according to the schema
        const orderData = {
          user: userId,
          items: [{
            itemId: product._id,
            name: product.name,
            quantity: 1,
            price: product.price
          }],
          totalAmount: product.price,
          deliveryAddress: {
            ...formValues.deliveryAddress,
            // You could integrate with a geocoding API here to get coordinates
            coordinates: {
              lat: null,
              lng: null
            }
          },
          paymentMethod: formValues.paymentMethod,
          deliveryDate: new Date(formValues.deliveryDate),
          deliveryTimeSlot: {
            start,
            end
          },
          notes: formValues.notes
        };

        console.log("Sending order data:", orderData);
        
        // Send purchase request to backend
        const response = await fetch('http://localhost:5000/orders/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT token
          },
          body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Purchase failed');
        }
        
        const result = await response.json();
        
        // Show success message
        Swal.fire({
          title: "Order Placed Successfully!",
          text: `Order #${result._id} has been confirmed. You will receive a confirmation email shortly.`,
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      } catch (error) {
        console.error("Order placement error:", error);
        
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to place your order. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  if (loading && products.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile filter toggle button */}
      <div className="fixed bottom-4 right-4 md:hidden z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Filter size={24} />}
        </button>
      </div>

      {/* Mobile filters menu */}
      <MobileFilterMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        priceRange={priceRange}
        setPriceRange={handlePriceRangeChange}
        manufacturers={manufacturers}
        selectedManufacturers={selectedManufacturers}
        handleManufacturerChange={handleManufacturerChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Header />

        {/* Categories and Products */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            priceRange={priceRange}
            setPriceRange={handlePriceRangeChange}
            manufacturers={manufacturers}
            selectedManufacturers={selectedManufacturers}
            handleManufacturerChange={handleManufacturerChange}
          />

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Results summary & Items per page selector */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-700">
                  {loading ? (
                    'Loading products...'
                  ) : products.length > 0 ? (
                    `Showing ${(currentPage - 1) * limit + 1}-${Math.min((currentPage - 1) * limit + products.length, totalItems)} of ${totalItems} products`
                  ) : (
                    'No products found matching your criteria'
                  )}
                </p>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="limit-select" className="mr-2 text-sm text-gray-600">Items per page:</label>
                <select
                  id="limit-select"
                  value={limit}
                  onChange={handleLimitChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : products.length > 0 ? (
              <ProductList 
                products={products} 
                buyNow={buyNow} 
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}