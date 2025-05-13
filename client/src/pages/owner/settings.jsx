import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  User,
  Phone,
  Check,
  Clock,
  Search,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Navbar } from "@/components/poDash/Navbar";
import { Input } from "@/components/ui/input";

export default function DeliveryBoyManagement() {
  // State management
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Keep searchTerm but implement it properly
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    cnic: "",
    address: "",
    photo: "",
    status: "available", // available or busy
  });
  const [errors, setErrors] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("deliveryBoys");
    if (storedData) {
      setDeliveryBoys(JSON.parse(storedData));
    }
  }, []);

  // Save data to localStorage whenever deliveryBoys changes
  useEffect(() => {
    localStorage.setItem("deliveryBoys", JSON.stringify(deliveryBoys));
  }, [deliveryBoys]);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle file input for photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: reader.result,
        });

        // Clear error for photo
        if (errors.photo) {
          setErrors({
            ...errors,
            photo: null,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone must be 11 digits";
    }

    if (!formData.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    } else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic.trim())) {
      newErrors.cnic = "CNIC format should be #####-#######-#";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.photo) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new delivery boy
  const handleAddDeliveryBoy = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newDeliveryBoy = {
        ...formData,
        id: Date.now().toString(),
      };

      setDeliveryBoys([...deliveryBoys, newDeliveryBoy]);
      const deliveryBoy = await fetch(
        `${import.meta.env.VITE_API_URL}/delivery-boys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newDeliveryBoy),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create delivery boy");
      }

      resetForm();
      setShowAddModal(false);
    }
  };

  // Delete delivery boy
  const handleDeleteDeliveryBoy = (id) => {
    setDeliveryBoys(deliveryBoys.filter((boy) => boy.id !== id));
    setShowConfirmDelete(null);
  };

  // Toggle status (available/busy)
  const handleToggleStatus = (id) => {
    setDeliveryBoys(
      deliveryBoys.map((boy) => {
        if (boy.id === id) {
          return {
            ...boy,
            status: boy.status === "available" ? "busy" : "available",
          };
        }
        return boy;
      })
    );
    setShowDetailsModal(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      phone: "",
      cnic: "",
      address: "",
      photo: "",
      status: "available",
    });
    setErrors({});
  };

  // Close modal
  const handleCloseModal = () => {
    resetForm();
    setShowAddModal(false);
  };

  // Show delivery boy details
  const handleShowDetails = (id) => {
    const boy = deliveryBoys.find((b) => b.id === id);
    if (boy) {
      setShowDetailsModal(boy);
    }
  };

  // Filter boys based on search term
  const filteredBoys = deliveryBoys.filter(
    (boy) =>
      boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boy.phone.includes(searchTerm) ||
      boy.cnic.includes(searchTerm)
  );

  // Count available boys
  const availableBoys = deliveryBoys.filter(
    (boy) => boy.status === "available"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-56">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Delivery Boys */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <h2 className="text-gray-500 text-sm font-medium">
              Total Delivery Staff
            </h2>
            <div className="flex items-center mt-2">
              <User className="text-blue-500 mr-2" />
              <span className="text-gray-800 text-2xl font-bold">
                {deliveryBoys.length}
              </span>
            </div>
          </div>

          {/* Available Boys */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <h2 className="text-gray-500 text-sm font-medium">
              Available Staff
            </h2>
            <div className="flex items-center mt-2">
              <Check className="text-green-500 mr-2" />
              <span className="text-gray-800 text-2xl font-bold">
                {availableBoys}
              </span>
            </div>
          </div>

          {/* Busy Boys */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
            <h2 className="text-gray-500 text-sm font-medium">Busy Staff</h2>
            <div className="flex items-center mt-2">
              <Clock className="text-orange-500 mr-2" />
              <span className="text-gray-800 text-2xl font-bold">
                {deliveryBoys.length - availableBoys}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Boys Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Delivery Staff</h2>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                {/* Search icon (hidden on small screens) */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none sm:flex">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>

                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search staff..."
                  className="w-full text-gray-700 sm:pl-10 pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </button>
            </div>
          </div>

          {filteredBoys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBoys.map((boy) => (
                <div
                  key={boy.id}
                  onClick={() => handleShowDetails(boy.id)}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 duration-200"
                >
                  <div
                    className={`h-2 w-full ${
                      boy.status === "available"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      {boy.photo ? (
                        <img
                          src={boy.photo}
                          alt={boy.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {boy.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{boy.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          boy.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {boy.status === "available" ? "Available" : "Busy"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConfirmDelete(boy.id);
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        aria-label="Delete staff member"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <User className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No delivery staff found
              </h3>
              {searchTerm ? (
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms or clear the search.
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new delivery staff member.
                </p>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Delivery Boy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div
            className="relative mx-auto p-5 bg-white w-full max-w-md rounded-lg shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 rounded-t-lg"></div>
            <div className="flex justify-between items-center mb-4 pt-2">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Delivery Staff
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDeliveryBoy}>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`text-gray-800 mt-1 block w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    autoComplete="off"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03001234567"
                    className={`text-gray-800 mt-1 block w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    autoComplete="off"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* CNIC */}
                <div>
                  <label
                    htmlFor="cnic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CNIC Number *
                  </label>
                  <Input
                    type="text"
                    id="cnic"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    placeholder="12345-1234567-1"
                    className={`text-gray-800 mt-1 block w-full px-3 py-2 border ${
                      errors.cnic ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    autoComplete="off"
                  />
                  {errors.cnic && (
                    <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`text-gray-800 mt-1 block w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  ></textarea>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Photo *
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                      {formData.photo ? (
                        <img
                          src={formData.photo}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Upload photo
                      </label>
                      <Input
                        id="photo-upload"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </div>
                  </div>
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Add Staff Member
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div
            className="relative mx-auto p-5 bg-white w-full max-w-md rounded-lg shadow-2xl animate-fadeIn text-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 rounded-t-lg"></div>
            <button
              onClick={() => setShowDetailsModal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mt-3 flex flex-col items-center">
              {showDetailsModal.photo ? (
                <img
                  src={showDetailsModal.photo}
                  alt={showDetailsModal.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {showDetailsModal.name}
              </h3>

              <span
                className={`mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                  showDetailsModal.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {showDetailsModal.status === "available" ? "Available" : "Busy"}
              </span>

              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-gray-800 text-sm font-medium">
                      {showDetailsModal.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">CNIC</p>
                    <p className="text-gray-800 text-sm font-medium">
                      {showDetailsModal.cnic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-gray-800 text-sm font-medium">
                      {showDetailsModal.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleToggleStatus(showDetailsModal.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    showDetailsModal.status === "available"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  {showDetailsModal.status === "available"
                    ? "Set as Busy"
                    : "Set as Available"}
                </button>

                <button
                  onClick={() => {
                    setShowDetailsModal(null);
                    setShowConfirmDelete(showDetailsModal.id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div
            className="relative mx-auto p-5 bg-white w-full max-w-sm rounded-lg shadow-2xl text-center animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600 rounded-t-lg"></div>
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Delete Staff Member
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this staff member? This action
                cannot be undone.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDeliveryBoy(showConfirmDelete)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );;
}
