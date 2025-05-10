import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PetrolOwnerSignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
      address: ""
    },
    fuelAvailable: {
      petrol: 0,
      diesel: 0,
      hioctane: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFuelChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      fuelAvailable: {
        ...formData.fuelAvailable,
        [name]: Number(value)
      }
    });
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    const index = name === "longitude" ? 0 : 1;
    const newCoordinates = [...formData.location.coordinates];
    newCoordinates[index] = Number(value);
    
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        coordinates: newCoordinates
      }
    });
  };

  const validateStep1 = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Check password strength (at least 8 characters)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    // Check name length
    if (formData.name.length < 3) {
      setError("Fuel pump name must be at least 3 characters long");
      return false;
    }

    // Check email validity
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    // Check if coordinates are valid
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      setError("Please enter valid coordinates");
      return false;
    }

    // Check if address is provided
    if (!formData.location.address.trim()) {
      setError("Please enter a valid address");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    setError("");
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...dataToSubmit } = formData;

      // Make API call to backend registration endpoint
      const response = await fetch("/api/petrol-owners/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSubmit)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store user data or token
      localStorage.setItem("token", data.token);
      localStorage.setItem("petrolOwner", JSON.stringify(data.petrolOwner));

      // Redirect to dashboard upon successful registration
      navigate("/petrol-owner/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/petrol-owner/login");
  };

  // Render form based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Create your account
            </h2>
            <p className="text-gray-600 mb-6">
              Join our network of fuel providers and help drivers find you easily.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Fuel Pump Name"
                className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                required
                minLength={3}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                required
                minLength={8}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                required
              />
              
              <Button
                type="button"
                onClick={nextStep}
                className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
              >
                Next
              </Button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Location Details
            </h2>
            <p className="text-gray-600 mb-6">
              Help drivers find your fuel pump by providing accurate location information.
            </p>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.location.coordinates[0]}
                    onChange={handleCoordinatesChange}
                    placeholder="Longitude (e.g. 73.0479)"
                    step="0.0001"
                    className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.location.coordinates[1]}
                    onChange={handleCoordinatesChange}
                    placeholder="Latitude (e.g. 33.6844)"
                    step="0.0001"
                    className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <select
  name="location.address"
  value={formData.location.address}
  onChange={handleChange}
  className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
  required
>
  <option value="">Select your fuel pump address</option>
  <option value="123 Main Street, City A">123 Main Street, City A</option>
  <option value="456 Market Road, City B">456 Market Road, City B</option>
  <option value="789 Industrial Area, City C">789 Industrial Area, City C</option>
  {/* Add more options as needed */}
</select>

              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-1/2 py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Fuel Inventory
            </h2>
            <p className="text-gray-600 mb-6">
              Specify what types of fuel you provide and their current quantities.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Petrol (liters)</label>
                <input
                  type="number"
                  name="petrol"
                  value={formData.fuelAvailable.petrol}
                  onChange={handleFuelChange}
                  placeholder="Current petrol quantity"
                  className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diesel (liters)</label>
                <input
                  type="number"
                  name="diesel"
                  value={formData.fuelAvailable.diesel}
                  onChange={handleFuelChange}
                  placeholder="Current diesel quantity"
                  className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hi-Octane (liters)</label>
                <input
                  type="number"
                  name="hioctane"
                  value={formData.fuelAvailable.hioctane}
                  onChange={handleFuelChange}
                  placeholder="Current hi-octane quantity"
                  className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                >
                  {isLoading ? "Registering..." : "Complete Registration"}
                </Button>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-screen h-auto sm:h-screen">
      {/* Left Side */}
      <div className="w-full sm:w-1/2 relative bg-gray-900 flex flex-col justify-between p-8 overflow-hidden">
        {/* Background image with opacity */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/car1.jpg')",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center space-x-1 mb-24">
            <span className="text-red-200 text-3xl font-bold">P</span>
            <span className="bg-red-500 w-6 h-6"></span>
          </div>
        </div>

        <div className="relative z-10 pb-10">
          <h3 className="text-gray-400 text-xl mb-3">Welcome to</h3>
          <h1 className="text-white text-5xl font-bold mb-6">
            PetrolFinder Community
          </h1>
          <p className="text-gray-400">
            Join our network of fuel providers and grow your business
          </p>
          <a href="#" className="text-green-500 hover:text-green-400">
            Know more
          </a>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full sm:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fuel Station Registration
          </h1>
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Location</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Fuel</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>

          {step === 1 && (
            <div className="mt-8">
              <div className="relative flex items-center justify-center my-8">
                <div className="border-t border-gray-300 w-full" />
                <div className="absolute bg-white px-3 text-gray-500 text-sm">
                  or
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleLoginRedirect}
                    className="text-blue-500 font-medium"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetrolOwnerSignupPage;