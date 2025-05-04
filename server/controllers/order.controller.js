const Order = require('../models/order.model');
const { validateOrder } = require('../middlewares/validation.middleware');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const validationError = validateOrder(orderData);
        
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const order = new Order({
            ...orderData,
            user: req.user._id // Assuming user is authenticated and user info is in req.user
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}; 