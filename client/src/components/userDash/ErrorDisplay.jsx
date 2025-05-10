// File: components/ErrorDisplay.jsx
import React from 'react'

export default function ErrorDisplay({ error }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}