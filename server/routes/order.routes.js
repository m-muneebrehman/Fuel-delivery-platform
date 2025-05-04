const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateUser, isAdmin } = require('../middlewares/auth.middleware');

// User routes
router.post('/', authenticateUser, orderController.createOrder);
router.get('/my-orders', authenticateUser, orderController.getUserOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);
router.put('/:id/status', authenticateUser, orderController.updateOrderStatus);
router.put('/:id/cancel', authenticateUser, orderController.cancelOrder);

// Admin routes
router.get('/', authenticateUser, isAdmin, orderController.getAllOrders);

module.exports = router; 