const express = require('express');
const router = express.Router();
const FuelPriceController = require('../controllers/fuelPrice.controller');
const { adminMiddleware, authUser } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', FuelPriceController.getAllPrices);
router.get('/:fuelType', FuelPriceController.getPriceByType);
// Making update route public too (for demo purposes)
router.put('/update', FuelPriceController.updatePrice);

module.exports = router; 