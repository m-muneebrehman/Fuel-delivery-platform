import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, LogOut, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  // User data with loading state
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Get userId from storage
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("No userId found in storage");
          setError("You are not logged in. Please log in first.");
          navigate("/auth/user/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/users/profile?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data received:", data);

        const profileData = {
          name: data.userName,
          email: data.email,
          phone: data.phoneNumber || "",
        };

        setUserData(profileData);
        setFormData(profileData);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Could not load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with PUT request
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId")
      
      if (!userId) {
        throw new Error("No user ID found");
      }

      const response = await fetch(`http://localhost:5000/users/profile/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          userName: formData.name,
          phoneNumber: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log("Profile updated successfully:", updatedData);

      setUserData({ ...formData });
      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/auth/user/login");
  };

  // Show loading state while fetching initial data
  if (isLoading && !userData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !userData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Guard clause for when data isn't yet loaded
  if (!userData) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg border border-gray-200 shadow-sm transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Success notification */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center gap-2 animate-fadeIn">
            <CheckCircle size={20} className="text-green-500" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Error notification during update */}
        {error && userData && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <span className="text-red-500">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
              <User size={36} className="text-white/80" />
            </div>
          </div>

          {/* Profile content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">
                User Information
              </h3>
              <button
                onClick={() => {
                  if (isEditing) {
                    setFormData({ ...userData });
                    setError(null);
                  }
                  setIsEditing(!isEditing);
                }}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
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
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      isEditing
                        ? "border-gray-300"
                        : "border-gray-200 bg-gray-50"
                    } rounded-lg shadow-sm ${
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
                    value={formData.email || ""}
                    disabled={true} // Always disabled
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                  />
                </div>
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
                    value={formData.phone || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      isEditing
                        ? "border-gray-300"
                        : "border-gray-200 bg-gray-50"
                    } rounded-lg shadow-sm ${
                      isEditing
                        ? "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}