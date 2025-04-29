// routes/inventory.routes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

/**
 * @route   POST /inventory/
 * @desc    Create a new inventory item
 * @access  Admin
 */
router.post('/', 
  inventoryController.createInventoryItem
);

/**
 * @route   GET /inventory/
 * @desc    Get all inventory items with pagination and filtering
 * @access  Public
 */
router.get('/', 
  inventoryController.getAllInventoryItems
);

/**
 * @route   GET /inventory/:id
 * @desc    Get inventory item by ID
 * @access  Public
 */
router.get('/:id', 
  inventoryController.getInventoryItemById
);

/**
 * @route   GET /inventory/sku/:sku
 * @desc    Get inventory item by SKU
 * @access  Public
 */
router.get('/sku/:sku', 
  inventoryController.getInventoryItemBySku
);

/**
 * @route   PUT /inventory/:id
 * @desc    Update inventory item by ID
 * @access  Admin
 */
router.put('/:id',
  inventoryController.updateInventoryItem
);

/**
 * @route   PATCH /inventory/:id/quantity
 * @desc    Update inventory quantity
 * @access  Admin
 */
router.patch('/:id/quantity', 
  inventoryController.updateInventoryQuantity
);

/**
 * @route   DELETE /inventory/:id
 * @desc    Delete inventory item by ID
 */
router.delete('/:id', 
  inventoryController.deleteInventoryItem
);

/**
 * @route   GET /inventory/category/:category
 * @desc    Get inventory items by category
 * @access  Public
 */
router.get('/category/:category', 
  inventoryController.getInventoryItemsByCategory
);

/**
 * @route   GET /inventory/manufacturer/:manufacturer
 * @desc    Get inventory items by manufacturer
 * @access  Public
 */
router.get('/manufacturer/:manufacturer', 
  inventoryController.getInventoryItemsByManufacturer
);

/**
 * @route   GET /inventory/vehicle/search
 * @desc    Search inventory items by compatible vehicle
 * @access  Public
 */
router.get('/vehicle/search', 
  inventoryController.searchByCompatibleVehicle
);

module.exports = router;