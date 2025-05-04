const FuelOrder = require('../models/fuelOrder.model');
const MapsService = require('./maps.service');

class FuelOrderService {
    static async createOrder(orderData) {
        try {
            // Calculate delivery fare
            const fare = await MapsService.calculateDeliveryFare(
                orderData.fuelPump.coordinates,
                orderData.deliveryAddress.coordinates
            );

            // Calculate total amount (fuel cost + delivery fare)
            const fuelPrice = await this.getFuelPrice(orderData.fuelType);
            const totalAmount = (fuelPrice * orderData.quantity) + fare;

            const order = new FuelOrder({
                ...orderData,
                totalAmount,
                deliveryFare: fare,
                orderStatus: 'pending'
            });

            await order.save();
            return order;
        } catch (error) {
            throw new Error(`Failed to create fuel order: ${error.message}`);
        }
    }

    static async getFuelPrice(fuelType) {
        // This would typically come from a fuel price service or database
        const fuelPrices = {
            'Regular': 3.50,
            'Premium': 4.00,
            'Diesel': 3.75
        };
        return fuelPrices[fuelType] || 3.50;
    }

    static async getOrderById(orderId) {
        return await FuelOrder.findById(orderId)
            .populate('user', 'name email phone')
            .populate('fuelPump', 'location address coordinates')
            .populate('deliveryBoy', 'name phone');
    }

    static async getUserOrders(userId) {
        return await FuelOrder.find({ user: userId })
            .populate('fuelPump', 'location address')
            .sort({ createdAt: -1 });
    }

    static async updateOrderStatus(orderId, status) {
        const order = await FuelOrder.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.orderStatus = status;
        await order.save();
        return order;
    }

    static async assignDeliveryBoy(orderId, deliveryBoyId) {
        const order = await FuelOrder.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.deliveryBoy = deliveryBoyId;
        order.orderStatus = 'assigned';
        await order.save();
        return order;
    }

    static async getOrdersByStatus(status) {
        return await FuelOrder.find({ orderStatus: status })
            .populate('user', 'name phone')
            .populate('fuelPump', 'location address')
            .sort({ createdAt: -1 });
    }

    static async cancelOrder(orderId) {
        const order = await FuelOrder.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        if (['delivered', 'cancelled'].includes(order.orderStatus)) {
            throw new Error('Cannot cancel order in current status');
        }

        order.orderStatus = 'cancelled';
        await order.save();
        return order;
    }
}

module.exports = FuelOrderService; 