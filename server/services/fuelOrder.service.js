const FuelOrder = require('../models/fuelOrder.model');
const MapsService = require('./maps.service');
const FuelPump = require('../models/fuelPump.model');
const DeliveryBoy = require('../models/deliveryBoy.model');

class FuelOrderService {
    static async createOrder(orderData) {
        try {
            // Validate and get fuel pump data
            const fuelPumpData = await FuelPump.findById(orderData.fuelPump);
            if (!fuelPumpData) {
                throw new Error('Fuel pump not found');
            }

            // Calculate delivery fare - either use the provided fare or calculate it
            let fare = orderData.deliveryFee;
            if (!fare) {
                fare = await MapsService.calculateDeliveryFare(
                    fuelPumpData.location.coordinates,
                    orderData.deliveryAddress.coordinates
                );
            }

            // Calculate total amount - either use the provided fuel price or get it from the service
            let fuelPrice = orderData.fuelPrice;
            if (!fuelPrice) {
                fuelPrice = await this.getFuelPrice(orderData.fuelType);
            }
            
            const totalAmount = (fuelPrice * orderData.quantity) + fare;

            // Create and save order
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
        console.log('Looking up order by ID:', orderId);
        const order = await FuelOrder.findById(orderId)
            .populate('user', 'name email phone')
            .populate('fuelPump')
            .populate('deliveryBoy', 'name phone');
        
        if (order) {
            console.log('Order found:', order._id);
            console.log('Order.fuelPump:', order.fuelPump);
        } else {
            console.log('No order found with ID:', orderId);
        }
        
        return order;
    }

    static async getUserOrders(userId) {
        return await FuelOrder.find({ user: userId })
            .populate('fuelPump', 'location address')
            .sort({ createdAt: -1 });
    }

    static async updateOrderStatus(orderId, status) {
        const order = await FuelOrder.findById(orderId)
            .populate('deliveryBoy');
        
        if (!order) {
            throw new Error('Order not found');
        }

        // Free up the delivery boy if the order is delivered or cancelled
        if ((status === 'delivered' || status === 'cancelled') && order.deliveryBoy) {
            // Find the delivery boy and update their status
            const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy._id);
            if (deliveryBoy) {
                deliveryBoy.status = 'available';
                await deliveryBoy.save();
                console.log(`Delivery boy ${deliveryBoy._id} status updated to available`);
            }
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

        // Find the delivery boy and update their status to busy
        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
        if (!deliveryBoy) {
            throw new Error('Delivery boy not found');
        }
        
        if (deliveryBoy.status === 'busy') {
            throw new Error('This delivery boy is already assigned to another order');
        }
        
        // Update delivery boy status to busy
        deliveryBoy.status = 'busy';
        await deliveryBoy.save();
        
        // Update the order with the assigned delivery boy
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
        const order = await FuelOrder.findById(orderId)
            .populate('deliveryBoy');
        
        if (!order) {
            throw new Error('Order not found');
        }

        if (['delivered', 'cancelled'].includes(order.orderStatus)) {
            throw new Error('Cannot cancel order in current status');
        }

        // Free up the delivery boy if assigned
        if (order.deliveryBoy) {
            // Find the delivery boy and update their status
            const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy._id);
            if (deliveryBoy) {
                deliveryBoy.status = 'available';
                await deliveryBoy.save();
                console.log(`Delivery boy ${deliveryBoy._id} status updated to available due to order cancellation`);
            }
        }

        order.orderStatus = 'cancelled';
        await order.save();
        return order;
    }

    static async getFuelPumpOrders(fuelPumpId) {
        try {
            console.log('Getting orders for fuel pump ID:', fuelPumpId);
            
            // First let's examine if there are ANY orders in the system
            const allOrders = await FuelOrder.find({});
            console.log('Total orders in system:', allOrders.length);
            if (allOrders.length > 0) {
                console.log('Sample order fuelPump field:', allOrders[0].fuelPump);
            }
            
            const orders = await FuelOrder.find({ fuelPump: fuelPumpId })
                .populate('user', 'name email phone')
                .populate('deliveryBoy', 'fullName phoneNumber')
                .sort({ createdAt: -1 });

            console.log('Found orders for this pump:', orders.length);
            
            return orders;
        } catch (error) {
            console.error('Error in getFuelPumpOrders:', error);
            throw new Error(`Failed to get fuel pump orders: ${error.message}`);
        }
    }

    static async getDeliveryBoyOrders(deliveryBoyId) {
        try {
            const orders = await FuelOrder.find({ 
                deliveryBoy: deliveryBoyId,
                orderStatus: { $in: ['in-transit', 'pending', 'assigned'] }
            })
            .populate('user', 'userName')
            .populate('fuelPump', 'name location')
            .sort({ createdAt: -1 });

            return orders;
        } catch (error) {
            console.error('Error in getDeliveryBoyOrders:', error);
            throw new Error(`Failed to get delivery boy orders: ${error.message}`);
        }
    }

    static async updateDeliveryLocation(orderId, locationData) {
        try {
            const order = await FuelOrder.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Update the delivery boy location
            order.deliveryBoyLocation = {
                coordinates: locationData.coordinates,
                lastUpdated: new Date(),
                heading: locationData.heading,
                speed: locationData.speed,
                accuracy: locationData.accuracy
            };

            await order.save();
            return order;
        } catch (error) {
            console.error('Error in updateDeliveryLocation:', error);
            throw new Error(`Failed to update delivery location: ${error.message}`);
        }
    }

    static async markOrderAsDelivered(orderId) {
        try {
            const order = await FuelOrder.findById(orderId)
                .populate('deliveryBoy');
            
            if (!order) {
                throw new Error('Order not found');
            }

            // Update order status
            order.orderStatus = 'delivered';
            await order.save();

            // Update delivery boy status to available
            if (order.deliveryBoy) {
                const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy._id);
                if (deliveryBoy) {
                    deliveryBoy.status = 'available';
                    await deliveryBoy.save();
                }
            }

            return order;
        } catch (error) {
            console.error('Error in markOrderAsDelivered:', error);
            throw new Error(`Failed to mark order as delivered: ${error.message}`);
        }
    }
}

module.exports = FuelOrderService; 