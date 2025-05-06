import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear password match error when typing in either password field
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    // Check password strength (at least 5 characters)
    const passwordRegex = /^.{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError("Password must be at least 5 characters long");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset errors
    setError("");
    setPasswordError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to your backend registration endpoint
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store user data or token (if your API returns it)
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or login page
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/user/login");
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
            Join thousands of drivers worldwide and find fuel easily
          </p>
          <a href="#" className="text-green-500 hover:text-green-400">
            Know more
          </a>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full sm:w-1/2 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Create your account
          </h2>
          <p className="text-gray-600 mb-6">
            Join our community and discover the best fuel options near you.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
              required
              minLength={3}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
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
              minLength={6}
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />

            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
