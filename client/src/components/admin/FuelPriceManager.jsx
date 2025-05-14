import React, { useState, useEffect } from 'react';
import { Edit2, Save, RefreshCw, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const FuelPriceManager = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});

  // Fetch fuel prices
  const fetchPrices = async () => {
    setLoading(true);
    try {
      // Use a fallback URL if the environment variable isn't available
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Fetching fuel prices from:', `${apiUrl}/fuel-prices`);
      
      const response = await fetch(`${apiUrl}/fuel-prices`);
      if (!response.ok) {
        throw new Error(`Failed to fetch fuel prices: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different API response formats
      if (data.success && Array.isArray(data.data)) {
        console.log('Setting prices from data.data:', data.data);
        setPrices(data.data);
        
        // Initialize edit values
        const initialEditValues = {};
        data.data.forEach(price => {
          initialEditValues[price.fuelType] = {
            pricePerLiter: price.pricePerLiter
          };
        });
        setEditValues(initialEditValues);
        
        // Initialize all items as not in edit mode
        const initialEditMode = {};
        data.data.forEach(price => {
          initialEditMode[price.fuelType] = false;
        });
        setEditMode(initialEditMode);
      } 
      // If the API returns an array directly
      else if (Array.isArray(data)) {
        console.log('Setting prices from direct array:', data);
        setPrices(data);
        
        // Initialize edit values
        const initialEditValues = {};
        data.forEach(price => {
          initialEditValues[price.fuelType] = {
            pricePerLiter: price.pricePerLiter
          };
        });
        setEditValues(initialEditValues);
        
        // Initialize all items as not in edit mode
        const initialEditMode = {};
        data.forEach(price => {
          initialEditMode[price.fuelType] = false;
        });
        setEditMode(initialEditMode);
      }
      else {
        throw new Error(data.message || 'Failed to fetch fuel prices - unexpected response format');
      }
      setError(null);
    } catch (err) {
      setError('Error loading fuel prices: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleEdit = (fuelType) => {
    setEditMode({ ...editMode, [fuelType]: true });
  };

  const handleChange = (fuelType, field, value) => {
    setEditValues({
      ...editValues,
      [fuelType]: {
        ...editValues[fuelType],
        [field]: Number(value)
      }
    });
  };

  const handleSave = async (fuelType) => {
    try {
      // Use a fallback URL if the environment variable isn't available
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Updating fuel price at:', `${apiUrl}/fuel-prices/update`);
      
      const response = await fetch(`${apiUrl}/fuel-prices/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fuelType,
          pricePerLiter: editValues[fuelType].pricePerLiter
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update fuel price');
      }

      const data = await response.json();
      if (data.success) {
        // Update prices
        setPrices(prices.map(price => 
          price.fuelType === fuelType ? data.data : price
        ));
        
        // Exit edit mode
        setEditMode({ ...editMode, [fuelType]: false });
        
        toast.success(`${fuelType} price updated successfully`);
      } else {
        throw new Error(data.message || 'Failed to update fuel price');
      }
    } catch (err) {
      toast.error(err.message);
      console.error('Update error:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading fuel prices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Button onClick={fetchPrices} variant="outline" className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fuel Price Management</h1>
        <Button onClick={fetchPrices} variant="outline" size="icon" className="h-10 w-10">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">
        Manage the prices for different fuel types. Changes will be immediately reflected across the platform.
      </p>
      
      {prices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prices.map((price) => (
            <Card key={price.fuelType} className="shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  {price.fuelType}
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(price.updatedAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div>
                  <Label htmlFor={`price-${price.fuelType}`} className="text-sm font-medium text-gray-700">
                    Price Per Liter
                  </Label>
                  {editMode[price.fuelType] ? (
                    <Input
                      id={`price-${price.fuelType}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={editValues[price.fuelType]?.pricePerLiter || 0}
                      onChange={(e) => handleChange(price.fuelType, 'pricePerLiter', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(price.pricePerLiter)}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 flex justify-end">
                {editMode[price.fuelType] ? (
                  <Button 
                    onClick={() => handleSave(price.fuelType)} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleEdit(price.fuelType)} 
                    variant="outline"
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 text-yellow-700">
                No fuel prices found in the database. The prices will be initialized automatically when the server restarts.
              </p>
              <button 
                onClick={fetchPrices} 
                className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelPriceManager; 