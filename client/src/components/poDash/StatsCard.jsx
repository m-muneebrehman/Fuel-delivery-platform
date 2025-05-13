// File: components/StatsCard.jsx
import React from "react";

export const StatsCard = ({ title, value, icon, color }) => {
  // Generate the appropriate background color class based on the color prop
  const bgColorClass = `bg-${color}-50`;
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
          <div className="flex items-center mt-2">
            <span className="text-gray-800 text-3xl font-bold">{value}</span>
          </div>
        </div>
        <div className={`h-12 w-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};