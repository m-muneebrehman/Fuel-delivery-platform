import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import axios from "axios";

const PetrolOwnerLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/fuelpumps/login`, {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      if (data.verified === false) {
        Swal.fire({
          icon: "info",
          title: "Pending Verification",
          text: "Your account has been created but is yet to be verified. Please wait for approval.",
          confirmButtonColor: "#28a745",
        });
      } else {
        localStorage.setItem("ownerId", data.ownerId); // Store token in local storage
        navigate("/petrol-owner/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/auth/petrol-owner/signup");
  };

  const handleForgotPassword = () => {
    navigate("/petrol-owner/forgot-password");
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
            Manage your fuel station and grow your business
          </p>
          <a href="#" className="text-green-500 hover:text-green-400">
            Know more
          </a>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full sm:w-1/2 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Login to your station account
          </h2>
          <p className="text-gray-600 mb-6">
            It's nice to see you again. Ready to manage your fuel station?
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-500 text-sm"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative flex items-center justify-center my-8">
              <div className="border-t border-gray-300 w-full" />
              <div className="absolute bg-white px-3 text-gray-500 text-sm">
                or
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleSignup}
                  className="text-blue-500 font-medium"
                >
                  Register your station
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetrolOwnerLoginPage;
