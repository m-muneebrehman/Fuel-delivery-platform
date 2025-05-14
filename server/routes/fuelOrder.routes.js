const express = require('express');
const router = express.Router();
const FuelOrderController = require('../controllers/fuelOrder.controller');
const { authUser, adminMiddleware, authFuelPump } = require('../middlewares/auth.middleware');

// User routes - Specific routes first
router.post('/calculate-fare', authUser, FuelOrderController.calculateFare);
router.get('/nearby-pumps', authUser, FuelOrderController.getNearbyFuelPumps);
router.get('/user', authUser, FuelOrderController.getUserOrders);

// Fuel pump routes
router.get('/fuel-pump/orders', authFuelPump, FuelOrderController.getFuelPumpOrders);

// Parameterized routes after specific routes
router.post('/', authUser, FuelOrderController.createOrder);
router.get('/:orderId', authUser, FuelOrderController.getOrderById);
router.post('/:orderId/cancel', authUser, FuelOrderController.cancelOrder);

// fuel pump owner routes
router.get('/status/:status', authUser, adminMiddleware, FuelOrderController.getOrdersByStatus);
router.put('/:orderId/status', authUser, adminMiddleware, FuelOrderController.updateOrderStatus);
router.put('/:orderId/assign-delivery', authFuelPump, FuelOrderController.assignDeliveryBoy);

module.exports = router;  