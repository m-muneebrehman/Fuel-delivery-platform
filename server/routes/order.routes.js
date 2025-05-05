const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authUser, adminMiddleware } = require('../middlewares/auth.middleware');

// User routes
router.post('/', authUser, orderController.createOrder);
router.get('/my-orders', authUser, orderController.getUserOrders);
router.get('/:id', authUser, orderController.getOrderById);
router.put('/:id/status', authUser, orderController.updateOrderStatus);
router.put('/:id/cancel', authUser, orderController.cancelOrder);

// Admin routes
router.get('/', authUser, adminMiddleware, orderController.getAllOrders);

module.exports = router; 