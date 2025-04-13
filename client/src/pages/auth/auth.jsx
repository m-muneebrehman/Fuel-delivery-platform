import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle form submission
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400 opacity-10 rounded-full blur-xl animate-pulse"></div>

      {/* Main card container */}
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl relative bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
        {/* Glassmorphism inner card */}
        <div className="bg-white bg-opacity-90 rounded-xl m-1 overflow-hidden shadow-inner">
          {/* Header with brand */}
          <div className="pt-8 pb-4 px-8 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              YourBrand
            </h1>
            <p className="mt-2 text-gray-600">Your journey begins here</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Container with Animation */}
          <div className="relative h-[28rem] sm:h-[26rem] md:h-[28rem] overflow-hidden px-6 sm:px-8 md:px-10">
            <motion.div
              className="absolute w-full h-full"
              animate={{ y: activeTab === 'login' ? 0 : '-50%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Login Form */}
              <div className="h-full w-full px-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please enter your details to sign in
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>

              {/* Signup Form */}
              <div className="h-full w-full absolute top-full px-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
                  Create Account
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please fill in your information to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        id="signup-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input
                        type="email"
                        id="signup-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="signup-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-center pt-1">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms and Conditions</a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Social Login Options */}
          <div className="px-8 pb-8">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200">
                <i className="fab fa-google text-red-500"></i>
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200">
                <i className="fab fa-facebook-f text-blue-600"></i>
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200">
                <i className="fab fa-apple text-gray-800"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;