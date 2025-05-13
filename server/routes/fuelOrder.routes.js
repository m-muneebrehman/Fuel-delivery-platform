const express = require('express');
const router = express.Router();
const FuelOrderController = require('../controllers/fuelOrder.controller');
const { authUser, adminMiddleware } = require('../middlewares/auth.middleware');

// User routes - Specific routes first
router.post('/calculate-fare', authUser, FuelOrderController.calculateFare);
router.get('/nearby-pumps', authUser, FuelOrderController.getNearbyFuelPumps);
router.get('/user', authUser, FuelOrderController.getUserOrders);

// Parameterized routes after specific routes
router.post('/', authUser, FuelOrderController.createOrder);
router.get('/:orderId', authUser, FuelOrderController.getOrderById);
router.post('/:orderId/cancel', authUser, FuelOrderController.cancelOrder);

// fuel pump owner routes
router.get('/status/:status', authUser, adminMiddleware, FuelOrderController.getOrdersByStatus);
router.put('/:orderId/status', authUser, adminMiddleware, FuelOrderController.updateOrderStatus);
router.put('/:orderId/assign-delivery', authUser, adminMiddleware, FuelOrderController.assignDeliveryBoy);

module.exports = router;  