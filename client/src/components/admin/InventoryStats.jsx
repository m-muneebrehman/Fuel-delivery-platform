// components/InventoryStats.jsx
import React from 'react';
import { CircleDollarSign, ShoppingBag, AlertCircle, BarChart3 } from 'lucide-react'

const InventoryStats = ({ inventory }) => {
  // Calculate statistics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const outOfStockCount = inventory.filter(item => item.quantity === 0).length;
  const lowStockCount = inventory.filter(item => item.quantity > 0 && item.quantity <= 5).length;

  // Stats cards
  const stats = [
    {
      title: 'Total Products',
      value: totalItems,
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: <CircleDollarSign className="h-8 w-8 text-green-500" />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      bgColor: 'bg-red-100',
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      icon: <BarChart3 className="h-8 w-8 text-yellow-500" />,
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow flex items-center space-x-4"
        >
          <div className={`p-3 rounded-full ${stat.bgColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;