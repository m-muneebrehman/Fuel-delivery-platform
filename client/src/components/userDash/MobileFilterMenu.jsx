// File: components/MobileFilterMenu.jsx
import React from 'react'
import { ChevronRight, X, Filter } from 'lucide-react';

export default function MobileFilterMenu({
  isOpen,
  setIsOpen,
  categories,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  manufacturers,
  selectedManufacturers,
  handleManufacturerChange
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden">
      <div className="absolute right-0 top-0 h-full w-3/4 bg-white p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-gray-800" />
          </button>
        </div>

        <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
        <ul className="mb-6">
          {categories.map((category) => (
            <li key={category}>
              <button
                className={`flex items-center w-full text-left px-2 py-2 rounded-md transition ${
                  activeCategory === category
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  setIsOpen(false);
                }}
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

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-2">
            Price Range (up to ${priceRange})
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
          <h4 className="font-semibold text-gray-700 mb-2">
            Manufacturers
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
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

        <button
          className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <Filter size={16} className="mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}