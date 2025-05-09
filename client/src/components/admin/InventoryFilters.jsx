// components/InventoryFilters.jsx
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const InventoryFilters = ({ categories, manufacturers, filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      manufacturer: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
  };

  // Check if any filters are applied
  const hasActiveFilters = 
    filters.category !== '' || 
    filters.manufacturer !== '' || 
    filters.minPrice !== '' || 
    filters.maxPrice !== '' || 
    filters.inStock;

  return (
    <Accordion type="single" collapsible className="mb-6 bg-white rounded-lg shadow">
      <AccordionItem value="filters">
        <AccordionTrigger className="px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                Active
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <select
                name="manufacturer"
                value={filters.manufacturer}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Manufacturers</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex space-x-2">
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border border-gray-300 rounded-md py-2"
                  />
                </div>
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border border-gray-300 rounded-md py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center h-full">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleFilterChange}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              {hasActiveFilters && (
                <Button 
                  onClick={resetFilters} 
                  variant="outline"
                  className="text-gray-700"
                >
                  <X className="h-4 w-4 mr-2" /> 
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default InventoryFilters;