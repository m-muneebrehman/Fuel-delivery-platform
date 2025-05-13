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
  Mail,
  ShieldCheck,
  ShieldAlert,
  Building,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/poDash/Navbar";
import { StatsCard } from "@/components/poDash/StatsCard";
import { DeliveryBoyCard } from "@/components/poDash/DeliveryBoyCard";
import { AddDeliveryBoyModal } from "@/components/poDash/AddDeliveryBoyModal";
import { DetailsModal } from "@/components/poDash/DetailsModal";
import { ConfirmDeleteModal } from "@/components/poDash/ConfirmDeleteModal";
import { EmptyState } from "@/components/poDash/EmptyState";
import { toast } from "sonner";

export default function DeliveryBoyManagement() {
  // State management
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const pumpId = localStorage.getItem("ownerId");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    cnicNumber: "",
    address: "",
    photo: "",
    photoPreview: null, // Add photo preview state
    fuelPump: pumpId,
    status: "available",
    isVerified: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Fetch delivery boys on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch delivery boys from API
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/deliveryBoys/getDeliveryBoys?pumpId=${pumpId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch delivery boys");
        }

        console.log("This was fine");

        const data = await response.json();
        setDeliveryBoys(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle file input for photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for preview
      const photoPreviewUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        photo: file, // store the actual File object
        photoPreview: photoPreviewUrl, // store the preview URL
      });

      // Clear error for photo
      if (errors.photo) {
        setErrors({
          ...errors,
          photo: null,
        });
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone must be 11 digits";
    }

    if (!formData.cnicNumber.trim()) {
      newErrors.cnicNumber = "CNIC is required";
    } else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnicNumber.trim())) {
      newErrors.cnicNumber = "CNIC format should be #####-#######-#";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.photo) {
      newErrors.photo = "Photo is required";
    }

    if (!formData.fuelPump) {
      newErrors.fuelPump = "Fuel pump assignment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new delivery boy
  const handleAddDeliveryBoy = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      console.log("Form data: ", formData);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("cnicNumber", formData.cnicNumber);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("fuelPump", formData.fuelPump);
        formDataToSend.append("photo", formData.photo); // This is the File object

        console.log("Form data to send: ", formDataToSend);

        const response = await fetch(
          "http://localhost:5000/deliveryBoys/register",
          {
            method: "POST",
            body: formDataToSend, // ✅ No JSON.stringify
            // ❌ Don't manually set Content-Type
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create delivery boy");
        }

        // Add new delivery boy to state
        setDeliveryBoys([...deliveryBoys, data.data]);

        toast.success("Success", {
          description: "Delivery staff member added successfully",
        });

        resetForm();
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding delivery boy:", error);
        toast.error("Error", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete delivery boy
  const handleDeleteDeliveryBoy = async (id) => {
    console.log("ID: ", id);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/deliveryBoys/delete?boyId=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete delivery boy");
      }

      // Remove from state
      setDeliveryBoys(deliveryBoys.filter((boy) => boy._id !== id));

      toast.success("Success", {
        description: "Delivery staff member deleted successfully",
      });

      setShowConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting delivery boy:", error);
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle status (available/busy)
  const handleToggleStatus = async (id, currentStatus) => {
    setIsLoading(true);
    const newStatus = currentStatus === "available" ? "busy" : "available";
    console.log("New status: ", newStatus);
    console.log("ID: ", id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/deliveryBoys/statusChange?boyId=${id}&status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }

      // Update state
      setDeliveryBoys(
        deliveryBoys.map((boy) => {
          if (boy._id === id) {
            return {
              ...boy,
              status: newStatus,
            };
          }
          return boy;
        })
      );

      toast.success("Success", {
        description: `Status updated to ${newStatus}`,
      });

      setShowDetailsModal(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    // Revoke the URL object to avoid memory leaks
    if (formData.photoPreview) {
      URL.revokeObjectURL(formData.photoPreview);
    }
    
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      cnicNumber: "",
      address: "",
      photo: "",
      photoPreview: null,
      fuelPump: pumpId,
      status: "available",
      isVerified: false,
    });
    setShowPassword(false);
    setErrors({});
  };

  // Close modal
  const handleCloseModal = () => {
    resetForm();
    setShowAddModal(false);
  };

  // Show delivery boy details
  const handleShowDetails = (id) => {
    const boy = deliveryBoys.find((b) => b._id === id);
    if (boy) {
      setShowDetailsModal(boy);
    }
  };

  // Filter boys based on search term
  const filteredBoys = deliveryBoys.filter(
    (boy) =>
      boy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boy.phoneNumber.includes(searchTerm) ||
      boy.cnicNumber.includes(searchTerm)
  );

  // Count available and busy boys
  const availableBoys = deliveryBoys.filter(
    (boy) => boy.status === "available"
  ).length;

  const verifiedBoys = deliveryBoys.filter((boy) => boy.isVerified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 w-full">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Delivery Staff Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Staff"
            value={deliveryBoys.length}
            icon={<User className="text-blue-500" size={24} />}
            color="blue"
          />
          <StatsCard
            title="Available Staff"
            value={availableBoys}
            icon={<Check className="text-green-500" size={24} />}
            color="green"
          />
          <StatsCard
            title="Busy Staff"
            value={deliveryBoys.length - availableBoys}
            icon={<Clock className="text-orange-500" size={24} />}
            color="orange"
          />
          <StatsCard
            title="Verified Staff"
            value={verifiedBoys}
            icon={<ShieldCheck className="text-purple-500" size={24} />}
            color="purple"
          />
        </div>

        {/* Delivery Boys Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Delivery Staff
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search staff..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Add Button */}
              <Button
                type="button"
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Loading...
              </p>
            </div>
          ) : filteredBoys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBoys.map((boy) => (
                <DeliveryBoyCard
                  key={boy._id}
                  boy={boy}
                  onShowDetails={handleShowDetails}
                  onConfirmDelete={setShowConfirmDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              searchTerm={searchTerm}
              onAddClick={() => setShowAddModal(true)}
            />
          )}
        </div>
      </main>

      {/* Add Delivery Boy Modal */}
      {showAddModal && (
        <AddDeliveryBoyModal
          formData={formData}
          errors={errors}
          showPassword={showPassword}
          onClose={handleCloseModal}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onPhotoChange={handlePhotoChange}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSubmit={handleAddDeliveryBoy}
          isLoading={isLoading}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          boy={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
          onToggleStatus={handleToggleStatus}
          onConfirmDelete={setShowConfirmDelete}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <ConfirmDeleteModal
          id={showConfirmDelete}
          onCancel={() => setShowConfirmDelete(null)}
          onConfirm={handleDeleteDeliveryBoy}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}