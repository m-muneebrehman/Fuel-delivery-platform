import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const route = useNavigate();

  const handleLogin = () => {
    route("/user/dashboard"); // Replace with your desired route
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
            Home to thousands of drivers worldwide
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
            Login to your account
          </h2>
          <p className="text-gray-600 mb-6">
            It's nice to see you again. Ready to find fuel?
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your username or email"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Your password"
              className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-md"
            />
            <Button
              onClick={handleLogin}
              className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
            >
              Login
            </Button>

            <div className="flex justify-between items-center mt-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="h-4 w-4" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 text-sm">
                Forgot password?
              </a>
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
                <a href="#" className="text-blue-500 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
