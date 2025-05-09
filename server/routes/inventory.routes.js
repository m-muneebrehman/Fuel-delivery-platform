// routes/inventory.routes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller')

router.post('/createItem', 
  inventoryController.createInventoryItem
);

router.get('/', 
  inventoryController.getAllInventoryItems
);

router.get('/:id', 
  inventoryController.getInventoryItemById
);

router.get('/sku/:sku', 
  inventoryController.getInventoryItemBySku
);

router.put('/updateItem',
  inventoryController.updateInventoryItem
);

router.patch('/:id/quantity', 
  inventoryController.updateInventoryQuantity
);

router.delete('/deleteItem', 
  inventoryController.deleteInventoryItem
);

router.get('/category/:category', 
  inventoryController.getInventoryItemsByCategory
);

router.get('/manufacturer/:manufacturer', 
  inventoryController.getInventoryItemsByManufacturer
);

router.get('/vehicle/search', 
  inventoryController.searchByCompatibleVehicle
);

module.exports = router;