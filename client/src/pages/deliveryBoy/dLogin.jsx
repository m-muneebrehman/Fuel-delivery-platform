import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import axios from "axios";
import { Building2, Lock, Mail, ChevronRight } from "lucide-react";

const LoginDeliveryBoy = () => {
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
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/deliveryBoys/login`, {
      email: formData.email,
      password: formData.password
    });

    const { token, data: user } = response.data;

    if (user.isVerified === false) {
      Swal.fire({
        icon: "info",
        title: "Pending Verification",
        text: "Your account has been created but is yet to be verified. Please wait for approval.",
        confirmButtonColor: "#28a745",
      });
    } else {
      // Save token if needed
      localStorage.setItem("authToken", token);
      localStorage.setItem("boyId", user._id);
      navigate("/deliveryBoy/dashboard");
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

  return (
    <div className="min-h-screen flex bg-[#0F172A]">
      {/* Left Side - Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/car1.jpg')] bg-cover bg-center mix-blend-overlay opacity-50" />
        <div className="relative z-10 w-full p-12 flex flex-col justify-between">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-lg p-2 rounded-xl hover:scale-105 transition-transform duration-300">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300">Delivery Boy</span>
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight animate-slide-up">
              <span className="inline-block hover:text-blue-400 transition-colors duration-300">Manage</span>{" "}
              <span className="inline-block hover:text-purple-400 transition-colors duration-300">Your</span>{" "}
              <span className="inline-block hover:text-blue-400 transition-colors duration-300">Orders</span>{" "}
              <span className="inline-block hover:text-purple-400 transition-colors duration-300">with Confidence</span>
            </h1>
            <p className="text-blue-100/80 text-lg mb-8 animate-fade-in-delay">
              Join thousands of delivery boys who trust PetrolFinder to streamline their operations and boost their business.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:scale-105 hover:bg-white/10 transition-all duration-300 animate-slide-up-delay">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2 hover:text-blue-400 transition-colors duration-300">Smart Management</h4>
                <p className="text-blue-100/60 text-sm">Streamline your daily operations</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:scale-105 hover:bg-white/10 transition-all duration-300 animate-slide-up-delay-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl font-bold text-purple-400">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2 hover:text-purple-400 transition-colors duration-300">Real-time Analytics</h4>
                <p className="text-blue-100/60 text-sm">Track your business growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-3 mb-8 animate-fade-in">
            <div className="bg-blue-600/10 p-2 rounded-xl hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300">PetrolFinder</span>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 animate-slide-up">
                Welcome <span className="text-blue-400">Back!</span>
              </h1>
              <p className="text-blue-100/60 animate-fade-in-delay">Sign in to manage your deliveries</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 animate-shake">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-100/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                    required
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-100/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-white/10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl transition-all focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#0F172A] hover:scale-105 transform"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.5s ease-out 0.4s forwards;
          opacity: 0;
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginDeliveryBoy;
