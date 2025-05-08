import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  LogOut,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirects

export default function UserProfile() {
  // User data with loading state
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirects

  // Get token from both localStorage and sessionStorage
  const getAuthToken = () => {
    const localToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');
    return localToken || sessionToken || "";
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        console.log("Using token:", token.substring(0, 10) + "...");
        
        const response = await fetch('http://localhost:5000/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        

        console.log("Profile response status:", response.status);

        if (response.status === 401 || response.status === 403) {
          console.error("Authentication error:", response.status);
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data received:", data);
        
        // Transform backend data to match component needs
        const profileData = {
          name: data.userName,
          email: data.email,
          phone: data.phoneNumber || '',
          joinDate: data.createdAt || new Date().toISOString(),
          avatar: data.avatar || null
        };
        
        setUserData(profileData);
        setFormData(profileData);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        
        if (err.message.includes("401") || err.message.includes("403")) {
          setError("You are not authorized. Please log in again.");
          // Clear tokens on auth error
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          // Redirect after a short delay
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError("Could not load profile data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

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
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Fix: Use correct backend URL
      const response = await fetch('http://localhost:5000/users/profile', {
        method: 'PUT', // or PATCH depending on your API design
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // Include cookies if your backend uses them
        body: JSON.stringify({
          userName: formData.name,
          phoneNumber: formData.phone
          // Don't send email as it's read-only
        })
      });
      
      if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
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
    // Clear auth tokens from both storages
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Unknown date";
    }
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
      <div className="max-w-3xl mx-auto">
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white/80" />
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                <p className="text-blue-100">{userData.email}</p>
                <p className="text-sm text-blue-200 mt-1">
                  Member since {formatDate(userData.joinDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
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
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div>
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
                      value={formData.name || ''}
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
                      value={formData.email || ''}
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
                      value={formData.phone || ''}
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-sm transition-colors disabled:opacity-70"
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
    </div>
  );
}