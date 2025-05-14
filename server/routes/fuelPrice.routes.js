const express = require('express');
const router = express.Router();
const fuelPriceController = require('../controllers/fuelPrice.controller');

// Public routes
router.get('/', fuelPriceController.getAllPrices);
router.get('/:fuelType', fuelPriceController.getPriceByType);

// Admin route for updating prices
router.put('/update', fuelPriceController.updatePrice);

module.exports = router; 