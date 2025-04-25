import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
} from "lucide-react";
import { Navbar } from "./Navbar";

export default function UserProfile() {
  // Dummy user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com", // This will be read-only
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, CA 94321",
    birthdate: "1990-05-15",
    joinDate: "2023-04-10", // This will be read-only
    avatar: null,
    bio: "Professional software developer with 5+ years of experience in web development.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setIsEditing(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
    <Navbar />
      <div className="bg-gray-50 min-h-screen my-33">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Profile updated successfully!
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md">
                      <Camera size={16} className="text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="opacity-80">{userData.email}</p>
                  <p className="text-sm opacity-70">
                    Member since {formatDate(userData.joinDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <button
                  onClick={() => {
                    if (isEditing) {
                      setFormData({ ...userData });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="text-blue-600 font-medium"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          isEditing
                            ? "border-gray-300"
                            : "border-gray-200 bg-gray-50"
                        } rounded-md shadow-sm ${
                          isEditing
                            ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true} // Always disabled
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          isEditing
                            ? "border-gray-300"
                            : "border-gray-200 bg-gray-50"
                        } rounded-md shadow-sm ${
                          isEditing
                            ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          isEditing
                            ? "border-gray-300"
                            : "border-gray-200 bg-gray-50"
                        } rounded-md shadow-sm ${
                          isEditing
                            ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          isEditing
                            ? "border-gray-300"
                            : "border-gray-200 bg-gray-50"
                        } rounded-md shadow-sm ${
                          isEditing
                            ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Join Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formatDate(userData.joinDate)}
                        disabled={true} // Always disabled
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      This field cannot be modified
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full p-3 border ${
                      isEditing
                        ? "border-gray-300"
                        : "border-gray-200 bg-gray-50"
                    } rounded-md shadow-sm ${
                      isEditing
                        ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        : ""
                    }`}
                  ></textarea>
                </div>

                {/* Save button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
