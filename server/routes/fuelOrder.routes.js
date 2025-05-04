const express = require('express');
const router = express.Router();
const FuelOrderController = require('../controllers/fuelOrder.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// User routes
router.post('/', authMiddleware, FuelOrderController.createOrder);
router.get('/user', authMiddleware, FuelOrderController.getUserOrders);
router.get('/:orderId', authMiddleware, FuelOrderController.getOrderById);
router.post('/:orderId/cancel', authMiddleware, FuelOrderController.cancelOrder);
router.post('/calculate-fare', authMiddleware, FuelOrderController.calculateFare);
router.get('/nearby-pumps', authMiddleware, FuelOrderController.getNearbyFuelPumps);

// Admin routes
router.get('/status/:status', authMiddleware, adminMiddleware, FuelOrderController.getOrdersByStatus);
router.put('/:orderId/status', authMiddleware, adminMiddleware, FuelOrderController.updateOrderStatus);
router.put('/:orderId/assign-delivery', authMiddleware, adminMiddleware, FuelOrderController.assignDeliveryBoy);

module.exports = router; 