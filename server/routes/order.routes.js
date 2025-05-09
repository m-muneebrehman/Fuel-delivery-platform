// File: routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders for authenticated user
router.get('/getOrders', orderController.getUserOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (admin only route, add admin middleware if needed)
router.patch('/:id/status', orderController.updateOrderStatus);

// Cancel an order
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;