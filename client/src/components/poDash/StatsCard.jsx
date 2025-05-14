// File: components/StatsCard.jsx
import React from "react";

export const StatsCard = ({ title, value, icon, color }) => {
  // Glassmorphism + gradient + fade-in
  const bgGradient =
    color === "blue"
      ? "from-blue-500/30 to-blue-700/30"
      : color === "green"
      ? "from-green-400/30 to-green-600/30"
      : color === "orange"
      ? "from-orange-400/30 to-orange-600/30"
      : color === "purple"
      ? "from-purple-400/30 to-purple-700/30"
      : "from-gray-200/30 to-gray-400/30";

  return (
    <div
      className={`backdrop-blur-md bg-gradient-to-br ${bgGradient} rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 p-6 flex items-center justify-between transition-all duration-300 animate-fade-in-up`}
      style={{ minHeight: 110 }}
    >
      <div>
        <h2 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1 tracking-wide">
          {title}
        </h2>
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">
          {value}
        </span>
      </div>
      <div className="h-14 w-14 rounded-full flex items-center justify-center bg-white/30 dark:bg-gray-900/30 shadow-lg">
        {icon}
      </div>
    </div>
  );
};

// Add fade-in-up animation
// In your global CSS (e.g., index.css or tailwind.css), add:
// @keyframes fade-in-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
// .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both; }