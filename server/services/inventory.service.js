// services/inventory.service.js
const Inventory = require('../models/inventory.model');

/**
 * Service for handling inventory operations
 */
class InventoryService {
  /**
   * Create a new inventory item
   * @param {Object} inventoryData - The inventory item data
   * @returns {Promise<Object>} Created inventory item
   */
  async createInventoryItem(inventoryData) {
    try {
      const newItem = new Inventory(inventoryData);
      return await newItem.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all inventory items with optional filtering
   * @param {Object} filter - Optional filter criteria
   * @param {Object} options - Optional query options (pagination, sorting)
   * @returns {Promise<Array>} List of inventory items
   */
  async getAllInventoryItems(filter = {}, options = {}) {
    try {
      const { limit = 10, page = 1, sortBy = 'name', sortOrder = 'asc' } = options;
      const skip = (page - 1) * limit;
      
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      return await Inventory.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of inventory items with optional filtering
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise<Number>} Total count of inventory items
   */
  async getInventoryCount(filter = {}) {
    try {
      return await Inventory.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get inventory item by ID
   * @param {String} id - Inventory item ID
   * @returns {Promise<Object>} Inventory item
   */
  async getInventoryItemById(id) {
    try {
      const item = await Inventory.findById(id);
      if (!item) {
        throw new Error('Inventory item not found');
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get inventory items by SKU
   * @param {String} sku - Product SKU
   * @returns {Promise<Object>} Inventory item
   */
  async getInventoryItemBySku(sku) {
    try {
      const item = await Inventory.findOne({ sku });
      if (!item) {
        throw new Error('Inventory item not found');
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update inventory item by ID
   * @param {String} id - Inventory item ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated inventory item
   */
  async updateInventoryItem(id, updateData) {
    try {
      const item = await Inventory.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!item) {
        throw new Error('Inventory item not found');
      }
      
      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update inventory quantity
   * @param {String} id - Inventory item ID
   * @param {Number} quantityChange - Quantity to add (positive) or subtract (negative)
   * @returns {Promise<Object>} Updated inventory item
   */
  async updateInventoryQuantity(id, quantityChange) {
    try {
      const item = await Inventory.findById(id);
      
      if (!item) {
        throw new Error('Inventory item not found');
      }
      
      const newQuantity = item.quantity + quantityChange;
      
      if (newQuantity < 0) {
        throw new Error('Insufficient inventory quantity');
      }
      
      item.quantity = newQuantity;
      return await item.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete inventory item by ID
   * @param {String} id - Inventory item ID
   * @returns {Promise<Object>} Deleted inventory item
   */
  async deleteInventoryItem(id) {
    try {
      const item = await Inventory.findByIdAndDelete(id);
      
      if (!item) {
        throw new Error('Inventory item not found');
      }
      
      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get inventory items by category
   * @param {String} category - Category name
   * @param {Object} options - Optional query options (pagination, sorting)
   * @returns {Promise<Array>} List of inventory items
   */
  async getInventoryItemsByCategory(category, options = {}) {
    try {
      return await this.getAllInventoryItems({ category }, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get inventory items by manufacturer
   * @param {String} manufacturer - Manufacturer name
   * @param {Object} options - Optional query options (pagination, sorting)
   * @returns {Promise<Array>} List of inventory items
   */
  async getInventoryItemsByManufacturer(manufacturer, options = {}) {
    try {
      return await this.getAllInventoryItems({ manufacturer }, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search inventory items by compatible vehicle
   * @param {Object} vehicle - Vehicle details (make, model, year)
   * @param {Object} options - Optional query options (pagination, sorting)
   * @returns {Promise<Array>} List of inventory items
   */
  async searchByCompatibleVehicle(vehicle, options = {}) {
    try {
      const query = {};
      
      if (vehicle.make) {
        query['compatibleVehicles.make'] = vehicle.make;
      }
      
      if (vehicle.model) {
        query['compatibleVehicles.model'] = vehicle.model;
      }
      
      if (vehicle.year) {
        query['compatibleVehicles.year'] = vehicle.year;
      }
      
      return await this.getAllInventoryItems(query, options);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InventoryService();