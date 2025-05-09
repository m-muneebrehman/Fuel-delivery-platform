// File: components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard'

export default function ProductList({ products, buyNow }) {
  // Function to render availability status based on quantity
  const renderAvailability = (quantity) => {
    if (quantity <= 0)
      return (
        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
      );
    if (quantity < 5)
      return (
        <span className="text-orange-500 text-sm font-medium">
          Low Stock ({quantity} left)
        </span>
      );
    if (quantity < 10)
      return (
        <span className="text-yellow-500 text-sm font-medium">
          Available ({quantity} in stock)
        </span>
      );
    return (
      <span className="text-green-600 text-sm font-medium">
        In Stock ({quantity} available)
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters to find more products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          renderAvailability={renderAvailability}
          buyNow={buyNow}
        />
      ))}
    </div>
  );
}