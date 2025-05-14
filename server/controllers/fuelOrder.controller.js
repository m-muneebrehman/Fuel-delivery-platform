const FuelOrderService = require('../services/fuelOrder.service');
const MapsService = require('../services/maps.service');
const crypto = require('crypto');

class FuelOrderController {
    static async createOrder(req, res) {
        try {
            const orderData = {
                ...req.body,
                user: req.user._id
            };

            // Generate a 6-digit OTP using crypto
            const otp = crypto.randomInt(100000, 999999).toString().padStart(6, '0');
            orderData.otp = otp;

            const order = await FuelOrderService.createOrder(orderData);
            res.status(201).json({
                success: true,
                message: 'Fuel order created successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getOrderById(req, res) {
        try {
            const order = await FuelOrderService.getOrderById(req.params.orderId);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getUserOrders(req, res) {
        try {
            const orders = await FuelOrderService.getUserOrders(req.user._id);
            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateOrderStatus(req, res) {
        try {
            const order = await FuelOrderService.updateOrderStatus(
                req.params.orderId,
                req.body.status
            );
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async assignDeliveryBoy(req, res) {
        try {
            // Get the fuel pump ID from the authenticated user
            const fuelPumpId = req.fuelPump._id;
            console.log('Authenticated Fuel Pump ID:', fuelPumpId);
            
            // First check if the order exists
            const order = await FuelOrderService.getOrderById(req.params.orderId);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }
            
            console.log('Order Fuel Pump ID:', order.fuelPump);
            console.log('Order Fuel Pump ID (toString):', order.fuelPump.toString ? order.fuelPump.toString() : 'N/A');
            console.log('Authenticated Fuel Pump ID (toString):', fuelPumpId.toString());
            
            // TEMPORARILY BYPASSING OWNERSHIP CHECK FOR DEBUGGING
            /* 
            // Verify the order belongs to this fuel pump
            if (order.fuelPump.toString() !== fuelPumpId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to assign delivery boy to this order'
                });
            }
            */
            
            const updatedOrder = await FuelOrderService.assignDeliveryBoy(
                req.params.orderId,
                req.body.deliveryBoyId
            );
            
            res.status(200).json({
                success: true,
                message: 'Delivery boy assigned successfully',
                data: updatedOrder
            });
        } catch (error) {
            console.error('Error in assignDeliveryBoy:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getOrdersByStatus(req, res) {
        try {
            const orders = await FuelOrderService.getOrdersByStatus(req.params.status);
            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async cancelOrder(req, res) {
        try {
            const order = await FuelOrderService.cancelOrder(req.params.orderId);
            res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async calculateFare(req, res) {
        try {
            const { origin, destination } = req.body;
            const fare = await MapsService.calculateDeliveryFare(origin, destination);
            
            res.status(200).json({
                success: true,
                data: { fare }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getNearbyFuelPumps(req, res) {
        try {
            const { location, radius } = req.query;
            const pumps = await MapsService.getNearbyFuelPumps(
                JSON.parse(location),
                parseInt(radius) || 5000
            );
            
            res.status(200).json({
                success: true,
                data: pumps
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getFuelPumpOrders(req, res) {
        try {
            const fuelPumpId = req.fuelPump._id; // Get fuel pump ID from auth middleware
            const orders = await FuelOrderService.getFuelPumpOrders(fuelPumpId);
            
            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = FuelOrderController; 