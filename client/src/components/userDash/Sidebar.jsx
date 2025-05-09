// File: components/Sidebar.jsx
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react'

export default function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  manufacturers,
  selectedManufacturers,
  handleManufacturerChange
}) {
  return (
    <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md h-fit hidden md:block">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`flex items-center w-full text-left px-2 py-2 rounded-md transition ${
                activeCategory === category
                  ? "bg-red-100 text-red-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              <ChevronRight
                size={16}
                className={`mr-2 ${
                  activeCategory === category
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              />
              {category}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
            Price Range (up to ${priceRange})
            <ChevronDown size={16} className="text-gray-400" />
          </h4>
          <input
            type="range"
            className="w-full accent-red-600"
            min="0"
            max="1000"
            step="10"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>$0</span>
            <span>${priceRange}</span>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
            Manufacturers
            <ChevronDown size={16} className="text-gray-400" />
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {manufacturers.map((manufacturer) => (
              <label
                key={manufacturer}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  className="rounded text-red-600 focus:ring-red-500"
                  checked={selectedManufacturers.includes(manufacturer)}
                  onChange={() => handleManufacturerChange(manufacturer)}
                />
                <span>{manufacturer}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}