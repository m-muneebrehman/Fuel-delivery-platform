// PetrolOwnerSignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import ProgressIndicator from "./ProgressIndicator";
import SidePanel from "./SidePanel";
import Swal from "sweetalert2"

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
      coordinates: [73.0479, 33.6844], // Default to Islamabad [longitude, latitude]
      address: "",
    },
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
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 2 && !validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...dataToSubmit } = formData;

      console.log("Data to submit:", dataToSubmit);

      // Make API call to backend registration endpoint
      const response = await fetch("http://localhost:5000/fuelpumps/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const ownerId = data.fuelPumpId;
      localStorage.setItem("ownerId", ownerId);

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Your account creation request has been sent and will be verified soon.",
        confirmButtonColor: "#28a745",
      });


    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/petrol-owner/login");
  };

  return (
    <div className="flex flex-col sm:flex-row w-screen h-auto sm:h-screen">
      {/* Left Side */}
      <SidePanel />

      {/* Right Side */}
      <div className="w-full sm:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fuel Station Registration
          </h1>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={step} />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <Step1Form
                formData={formData}
                handleChange={handleChange}
                nextStep={nextStep}
              />
            ) : (
              <Step2Form
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                isLoading={isLoading}
              />
            )}
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
