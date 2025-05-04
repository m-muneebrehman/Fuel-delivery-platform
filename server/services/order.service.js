const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');

class OrderService {
    static async validateAndProcessOrder(orderData) {
        // Validate inventory availability for each item
        for (const item of orderData.items) {
            const inventoryItem = await Inventory.findById(item.itemId);
            
            if (!inventoryItem) {
                throw new Error(`Item ${item.name} not found in inventory`);
            }
            
            if (inventoryItem.quantity < item.quantity) {
                throw new Error(`Insufficient quantity for item ${item.name}`);
            }
        }

        // Calculate total amount
        const totalAmount = orderData.items.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);

        return {
            ...orderData,
            totalAmount,
            status: 'pending',
            paymentStatus: 'pending'
        };
    }

    static async updateInventory(order) {
        for (const item of order.items) {
            await Inventory.findByIdAndUpdate(
                item.itemId,
                { $inc: { quantity: -item.quantity } }
            );
        }
    }

    static async processPayment(orderId, paymentDetails) {
        // Here you would integrate with your payment gateway
        // This is a placeholder for payment processing logic
        const order = await Order.findById(orderId).populate('items.itemId');
        
        if (!order) {
            throw new Error('Order not found');
        }

        // Validate inventory again before processing payment
        for (const item of order.items) {
            const inventoryItem = await Inventory.findById(item.itemId);
            if (inventoryItem.quantity < item.quantity) {
                throw new Error(`Insufficient quantity for item ${item.name}`);
            }
        }

        // Simulate payment processing
        const paymentSuccess = true; // This would be determined by your payment gateway

        if (paymentSuccess) {
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            await order.save();
            await this.updateInventory(order);
            return order;
        } else {
            order.paymentStatus = 'failed';
            await order.save();
            throw new Error('Payment failed');
        }
    }

    static async getOrderStatus(orderId) {
        const order = await Order.findById(orderId).populate('items.itemId');
        if (!order) {
            throw new Error('Order not found');
        }
        return {
            status: order.status,
            paymentStatus: order.paymentStatus,
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };
    }

    static async getOrderHistory(userId) {
        return await Order.find({ user: userId })
            .populate('items.itemId')
            .sort({ createdAt: -1 });
    }
}

module.exports = OrderService; 