// components/InventoryForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react'
import { Button } from "@/components/ui/button";

const InventoryForm = ({ onSubmit, onCancel, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    manufacturer: '',
    sku: '',
    isActive: true,
    images: [],
    compatibleVehicles: [],
    specifications: {},
    warranty: {
      duration: '',
      description: ''
    }
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        quantity: initialData.quantity.toString(),
        warranty: {
          duration: initialData.warranty?.duration?.toString() || '',
          description: initialData.warranty?.description || ''
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (warranty.duration, warranty.description)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      const updatedSpecs = { ...formData.specifications };
      updatedSpecs[specKey.trim()] = specValue.trim();
      
      setFormData({
        ...formData,
        specifications: updatedSpecs
      });
      
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key) => {
    const updatedSpecs = { ...formData.specifications };
    delete updatedSpecs[key];
    
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  const handleAddVehicle = () => {
    if (vehicleMake.trim() && vehicleModel.trim() && vehicleYear) {
      setFormData({
        ...formData,
        compatibleVehicles: [
          ...formData.compatibleVehicles,
          {
            make: vehicleMake.trim(),
            model: vehicleModel.trim(),
            year: parseInt(vehicleYear, 10)
          }
        ]
      });
      
      setVehicleMake('');
      setVehicleModel('');
      setVehicleYear('');
    }
  };

  const handleRemoveVehicle = (index) => {
    const updatedVehicles = [...formData.compatibleVehicles];
    updatedVehicles.splice(index, 1);
    
    setFormData({
      ...formData,
      compatibleVehicles: updatedVehicles
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real application, you would handle file uploads differently.
      // This is a placeholder for demonstration purposes.
      const newImages = [...formData.images];
      for (let i = 0; i < e.target.files.length; i++) {
        // In a real implementation, you would upload the file to a server
        // and get back a URL. For this demo, we'll create object URLs.
        newImages.push(URL.createObjectURL(e.target.files[i]));
      }
      
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity || isNaN(parseInt(formData.quantity, 10)) || parseInt(formData.quantity, 10) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative integer';
    }
    
    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Manufacturer is required';
    }
    
    if (!formData.sku) {
      newErrors.sku = 'SKU is required';
    }
    
    if (formData.warranty.duration && (isNaN(parseInt(formData.warranty.duration, 10)) || parseInt(formData.warranty.duration, 10) < 0)) {
      newErrors['warranty.duration'] = 'Warranty duration must be a non-negative integer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to appropriate types
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        warranty: {
          ...formData.warranty,
          duration: formData.warranty.duration ? parseInt(formData.warranty.duration, 10) : null
        }
      };
      
      onSubmit(submissionData);
    }
  };

  const categories = [
    'Engine Parts', 
    'Brake System', 
    'Transmission', 
    'Electrical', 
    'Suspension', 
    'Body Parts', 
    'Filters', 
    'Other'
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Edit Item' : 'Add New Item'}
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
          className="h-10 w-10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Unique SKU"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`block w-full px-3 py-2 border ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Product description"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.manufacturer ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Manufacturer name"
                />
                {errors.manufacturer && (
                  <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`block w-full px-3 py-2 border ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`block w-full px-3 py-2 border ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active (available for sale)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative h-24 w-24 rounded border border-gray-300 group"
                >
                  <img 
                    src={image} 
                    alt={`Product image ${index + 1}`} 
                    className="h-full w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <Plus className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Add Image</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Upload product images. First image will be used as the cover image.
            </p>
          </div>

          {/* Specifications */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specification Key
                </label>
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specification Value
                </label>
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1.5kg"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddSpecification}
                  className="flex items-center"
                  disabled={!specKey.trim() || !specValue.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            {Object.keys(formData.specifications).length > 0 ? (
              <div className="border rounded-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecification(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">No specifications added yet.</p>
            )}
          </div>

          {/* Compatible Vehicles */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compatible Vehicles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Toyota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Corolla"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 2022"
                  min="1900"
                  max="2099"
                />
              </div>
              <div className="sm:col-span-3">
                <Button
                  type="button"
                  onClick={handleAddVehicle}
                  className="flex items-center"
                  disabled={!vehicleMake.trim() || !vehicleModel.trim() || !vehicleYear}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vehicle
                </Button>
              </div>
            </div>
            
            {formData.compatibleVehicles.length > 0 ? (
              <div className="border rounded-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.compatibleVehicles.map((vehicle, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.make}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">No compatible vehicles added yet.</p>
            )}
          </div>

          {/* Warranty Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Warranty Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Duration (months)
                </label>
                <input
                  type="number"
                  name="warranty.duration"
                  value={formData.warranty.duration}
                  onChange={handleChange}
                  min="0"
                  className={`block w-full px-3 py-2 border ${
                    errors['warranty.duration'] ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0"
                />
                {errors['warranty.duration'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['warranty.duration']}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Description
                </label>
                <textarea
                  name="warranty.description"
                  value={formData.warranty.description}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Warranty terms and conditions..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;