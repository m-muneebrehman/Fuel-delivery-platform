// File: components/Header.jsx
import React from 'react'

export default function Header() {
  // Scroll to product list section
  const handleScroll = () => {
    const el = document.getElementById('product-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg mb-8 overflow-hidden relative">
      <div className="flex items-center">
        <div className="p-4 md:p-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            Quality Auto Parts at Great Prices
          </h2>
          <p className="mb-4 md:mb-6 text-base md:text-lg">
            Find the perfect parts for your vehicle with our extensive
            inventory of genuine and OEM components
          </p>
          <button
            className="bg-white text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
            onClick={handleScroll}
          >
            Check it out
          </button>
        </div>
      </div>
    </div>
  );
}