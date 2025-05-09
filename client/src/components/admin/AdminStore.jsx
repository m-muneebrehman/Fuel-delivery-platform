// AdminStore.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import InventoryTable from './InventoryTable';
import InventoryForm from './InventoryForm';
import InventoryFilters from './InventoryFilters';
import InventoryStats from './InventoryStats';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AdminStore = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    manufacturer: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/inventory/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setInventory(data.data);
      setError(null);
    } catch (err) {
      setError('Error loading inventory: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle form submission for adding/editing
  const handleSubmit = async (formData) => {
    try {
      let response;
      
      if (isEditing) {
        // Update existing item
        console.log('formData', formData);
        response = await fetch(`http://localhost:5000/inventory/updateItem?itemId=${currentItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {

        console.log('formData', formData);
        // Add new item
        response = await fetch(`http://localhost:5000/inventory/createItem`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save item');
      }

      // Refresh the inventory list
      fetchInventory();
      handleCancelForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
    setShowAddForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/inventory/deleteItem?itemId=${itemToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item');
      }

      // Refresh inventory and close modal
      fetchInventory();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    // Search term filter
    const matchesSearch = 
      searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = 
      filters.category === '' || 
      item.category === filters.category;

    // Manufacturer filter
    const matchesManufacturer = 
      filters.manufacturer === '' || 
      item.manufacturer === filters.manufacturer;

    // Price range filter
    const matchesMinPrice = 
      filters.minPrice === '' || 
      item.price >= Number(filters.minPrice);
    
    const matchesMaxPrice = 
      filters.maxPrice === '' || 
      item.price <= Number(filters.maxPrice);

    // In stock filter
    const matchesInStock = 
      !filters.inStock || 
      item.quantity > 0;

    return (
      matchesSearch && 
      matchesCategory && 
      matchesManufacturer && 
      matchesMinPrice && 
      matchesMaxPrice && 
      matchesInStock
    );
  });

  // Get unique categories and manufacturers for filter dropdowns
  const categories = [...new Set(inventory.map(item => item.category))];
  const manufacturers = [...new Set(inventory.map(item => item.manufacturer))];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => fetchInventory()} 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New Item
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm ? (
        <InventoryForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancelForm} 
          initialData={currentItem} 
          isEditing={isEditing}
        />
      ) : (
        <>
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="instock">In Stock</TabsTrigger>
                <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 pr-4 border border-gray-300 rounded-md w-full sm:w-64"
                />
              </div>
            </div>

            <InventoryStats inventory={inventory} />

            <TabsContent value="all">
              <InventoryFilters 
                categories={categories}
                manufacturers={manufacturers}
                filters={filters}
                setFilters={setFilters}
              />
              
              <InventoryTable 
                inventory={filteredInventory} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="instock">
              <InventoryFilters 
                categories={categories}
                manufacturers={manufacturers}
                filters={{...filters, inStock: true}}
                setFilters={setFilters}
              />
              
              <InventoryTable 
                inventory={filteredInventory.filter(item => item.quantity > 0)} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="lowstock">
              <InventoryFilters 
                categories={categories}
                manufacturers={manufacturers}
                filters={filters}
                setFilters={setFilters}
              />
              
              <InventoryTable 
                inventory={filteredInventory.filter(item => item.quantity > 0 && item.quantity <= 5)} 
                onEdit={handleEdit} 
                onDelete={handleDeleteClick}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />
    </div>
  );
};

export default AdminStore;