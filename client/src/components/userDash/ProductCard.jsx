// File: components/ProductCard.jsx
import React from 'react'

export default function ProductCard({ product, renderAvailability, buyNow }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-gray-200 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/api/placeholder/240/160"
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        {!product.isActive && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Discontinued
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-1">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">
            SKU: {product.sku}
          </span>
        </div>
        <h3 className="font-bold text-lg mt-2 text-gray-800">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mt-2">
          <span className="text-gray-700 text-sm mr-2">
            Manufacturer:
          </span>
          <span className="text-gray-900 text-sm font-medium">
            {product.manufacturer}
          </span>
        </div>

        {/* Compatible vehicles summary */}
        {product.compatibleVehicles &&
          product.compatibleVehicles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="text-gray-700">
                Compatible with:{" "}
              </span>
              {product.compatibleVehicles
                .slice(0, 2)
                .map((vehicle, idx) => (
                  <span key={idx}>
                    {vehicle.make} {vehicle.model} {vehicle.year}
                    {idx <
                    Math.min(
                      1,
                      product.compatibleVehicles.length - 1
                    )
                      ? ", "
                      : ""}
                  </span>
                ))}
              {product.compatibleVehicles.length > 2 && (
                <span>
                  {" "}
                  + {product.compatibleVehicles.length - 2} more
                </span>
              )}
            </div>
          )}

        <div className="mt-2">
          {renderAvailability(product.quantity)}
        </div>

        {/* Warranty info if available */}
        {product.warranty && product.warranty.duration > 0 && (
          <div className="mt-2 flex items-center">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {product.warranty.duration} Month Warranty
            </span>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl text-gray-800">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => buyNow(product)}
              className={`${
                product.quantity <= 0 || !product.isActive
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white px-4 py-2 rounded-md transition text-sm font-semibold`}
              disabled={
                product.quantity <= 0 || !product.isActive
              }
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}