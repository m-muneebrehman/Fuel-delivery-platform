import React from 'react'
import { Navbar } from '@/components/userDash/Navbar'
import SparePartsStore from '@/components/userDash/store';
import { ShoppingBag, Package, Truck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main Content with proper spacing for fixed navbar */}
      <div className="pt-28">
        {/* Welcome Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                <p className="text-gray-600">Explore our wide range of spare parts and fuel delivery services.</p>
                
                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center">
                      <ShoppingBag className="h-8 w-8" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-100">Total Orders</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center">
                      <Package className="h-8 w-8" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-100">Spare Parts</p>
                        <p className="text-2xl font-bold">Browse</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer ring-2 ring-transparent hover:ring-green-300"
                    onClick={() => navigate('/user/fuel')}
                  >
                    <div className="flex items-center">
                      <Truck className="h-8 w-8" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-100">Fuel Delivery</p>
                        <p className="text-2xl font-bold">Order Now</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer ring-2 ring-transparent hover:ring-orange-300"
                    onClick={() => navigate('/user/profile')}
                  >
                    <div className="flex items-center">
                      <User className="h-8 w-8" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-100">Profile</p>
                        <p className="text-2xl font-bold">View</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <SparePartsStore />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard;