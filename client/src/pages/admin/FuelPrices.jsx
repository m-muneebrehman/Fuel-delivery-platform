import React from 'react';
import FuelPriceManager from '@/components/admin/FuelPriceManager';
import { Navbar } from '@/components/admin/navbar';

function FuelPrices() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16  m-20">
        <FuelPriceManager />
      </div>
    </div>
  );
}

export default FuelPrices; 