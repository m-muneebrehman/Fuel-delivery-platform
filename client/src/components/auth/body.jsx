import { Link } from "react-router-dom";

const AuthBody = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Petrol Owner Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 md:py-16 bg-gray-50 relative">
        <div className="w-full px-4 sm:px-6 md:px-12">
          <div className="mb-3">
            <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-medium">
              BUSINESS
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            For <span className="italic">Petrol Owners</span>
          </h1>

          <p className="text-gray-700 text-lg mb-16">
            Thousands of station owners have embraced the new way to manage
            their business and increase customer satisfaction.
          </p>

          <Link
            to="/auth/petrol-owner"
            className="bg-gray-900 hover:bg-gray-500 text-white px-8 py-3 rounded text-lg font-medium mb-12 inline-block text-center"
          >
            Login
          </Link>
        </div>

        {/* Vertical separator (only on md and up) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
      </div>

      {/* Horizontal separator for small screens */}
      <div className="block md:hidden h-px w-full bg-gray-300"></div>

      {/* Customer Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 md:py-16 bg-white">
        <div className="w-full px-4 sm:px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            For <span className="italic">Customers</span>
          </h1>

          <p className="text-gray-700 text-lg mb-16">
            Join over 10,000 drivers, find the best fuel prices, save on every
            fill-up, and get exclusive rewards.
          </p>

          <Link
            to="/auth/petrol-owner"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded text-lg font-medium mb-12 inline-block text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthBody;
