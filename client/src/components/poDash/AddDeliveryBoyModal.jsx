// File: AddDeliveryBoyModal.jsx
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  ShieldCheck,
  Upload,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddDeliveryBoyModal({
  formData,
  errors,
  showPassword,
  fuelPumps,
  onClose,
  onInputChange,
  onCheckboxChange,
  onPhotoChange,
  onTogglePassword,
  onSubmit,
  isLoading,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Add New Delivery Staff</h2>
          <p className="text-gray-500 mt-1">Enter the details of the new delivery staff member</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-4">Personal Information</h3>

              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onInputChange}
                    placeholder="John Doe"
                    className={`pl-10 ${
                      errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="example@email.com"
                    className={`pl-10 ${
                      errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onInputChange}
                    placeholder="●●●●●●"
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={onInputChange}
                    placeholder="03001234567"
                    className={`pl-10 ${
                      errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* CNIC */}
              <div className="space-y-1">
                <label htmlFor="cnicNumber" className="block text-sm font-medium text-gray-700">
                  CNIC Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="cnicNumber"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={onInputChange}
                    placeholder="12345-1234567-1"
                    className={`pl-10 ${
                      errors.cnicNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.cnicNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cnicNumber}</p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-lg mb-4">Additional Information</h3>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    placeholder="123 Main St, City"
                    className={`pl-10 ${
                      errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Staff Photo*
                </label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg px-6 py-8 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    errors.photo ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={onPhotoChange}
                    className="sr-only"
                  />
                  <label htmlFor="photo" className="cursor-pointer text-center">
                    {formData.photo ? (
                      <div className="space-y-2">
                        <img
                          src={formData.photo}
                          alt="Preview"
                          className="h-32 w-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                        />
                        <p className="text-sm text-gray-500">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                          <Upload size={24} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-600">Click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {errors.photo && (
                  <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
                )}
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                "Add Staff Member"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}