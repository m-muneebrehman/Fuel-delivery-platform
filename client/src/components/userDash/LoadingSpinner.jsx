// File: components/LoadingSpinner.jsx
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}