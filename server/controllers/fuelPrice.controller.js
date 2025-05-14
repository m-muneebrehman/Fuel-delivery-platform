const FuelPrice = require('../models/fuelPrice.model');

class FuelPriceController {
    // Get all fuel prices
    static async getAllPrices(req, res) {
        try {
            const prices = await FuelPrice.find({});
            res.status(200).json({
                success: true,
                data: prices
            });
        } catch (error) {
            console.error('Error fetching fuel prices:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching fuel prices'
            });
        }
    }

    // Update a fuel price (admin only)
    static async updatePrice(req, res) {
        try {
            const { fuelType, pricePerLiter } = req.body;

            if (!fuelType || !pricePerLiter) {
                return res.status(400).json({
                    success: false,
                    message: 'Fuel type and price per liter are required'
                });
            }

            if (!['Regular', 'Premium', 'Diesel'].includes(fuelType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid fuel type. Must be Regular, Premium, or Diesel'
                });
            }

            const updatedPrice = await FuelPrice.updatePrice(
                fuelType,
                pricePerLiter
            );

            res.status(200).json({
                success: true,
                message: 'Fuel price updated successfully',
                data: updatedPrice
            });
        } catch (error) {
            console.error('Error updating fuel price:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating fuel price'
            });
        }
    }

    // Get price for a specific fuel type
    static async getPriceByType(req, res) {
        try {
            const { fuelType } = req.params;

            if (!['Regular', 'Premium', 'Diesel'].includes(fuelType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid fuel type. Must be Regular, Premium, or Diesel'
                });
            }

            const price = await FuelPrice.findOne({ fuelType });

            if (!price) {
                return res.status(404).json({
                    success: false,
                    message: `Price for ${fuelType} not found`
                });
            }

            res.status(200).json({
                success: true,
                data: price
            });
        } catch (error) {
            console.error('Error fetching fuel price:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching fuel price'
            });
        }
    }
}

module.exports = FuelPriceController; 