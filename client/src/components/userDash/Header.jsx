// File: components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg mb-8 overflow-hidden relative">
      <div className="md:flex items-center">
        <div className="p-6 md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            Quality Auto Parts at Great Prices
          </h2>
          <p className="mb-6">
            Find the perfect parts for your vehicle with our extensive
            inventory of genuine and OEM components
          </p>
          <button className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2 h-64 bg-gray-300">
          <img
            src="/api/placeholder/800/400"
            alt="Auto parts"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}