import { Link } from "react-router-dom"
import { Building2, Users } from "lucide-react"

const AuthBody = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-2">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Petrol Owner Card */}
        <div className="flex flex-col items-center bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 text-center">
              For <span className="text-blue-600">Petrol Owners</span>
            </h2>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-2 tracking-wide">BUSINESS</span>
          </div>
          <p className="text-gray-600 text-base md:text-lg text-center mb-8">
            Thousands of station owners have embraced the new way to manage
            their business and increase customer satisfaction.
          </p>
          <Link
            to="/auth/petrol-owner/login"
            className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login as Owner
          </Link>
        </div>

        {/* Customer Card */}
        <div className="flex flex-col items-center bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 text-center">
              For <span className="text-purple-600">Customers</span>
            </h2>
            <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full mb-2 tracking-wide">DRIVERS</span>
          </div>
          <p className="text-gray-600 text-base md:text-lg text-center mb-8">
            Join over 10,000 drivers, find the best fuel prices, save on every
            fill-up, and get exclusive rewards.
          </p>
          <Link
            to="/auth/user/login"
            className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Login as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthBody;
