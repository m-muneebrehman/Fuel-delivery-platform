const FuelPrice = require('../models/fuelPrice.model');

const fuelPriceController = {
    // Get all fuel prices
    getAllPrices: async (req, res) => {
        try {
            const prices = await FuelPrice.getAllPrices();
            res.status(200).json({
                success: true,
                data: prices
            });
        } catch (error) {
            console.error('Error in getAllPrices:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Get price by fuel type
    getPriceByType: async (req, res) => {
        try {
            const { fuelType } = req.params;
            const price = await FuelPrice.findOne({ fuelType });
            
            if (!price) {
                return res.status(404).json({
                    success: false,
                    message: 'Fuel price not found'
                });
            }

            res.status(200).json({
                success: true,
                data: price
            });
        } catch (error) {
            console.error('Error in getPriceByType:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Update fuel price
    updatePrice: async (req, res) => {
        try {
            const { fuelType, pricePerLiter } = req.body;

            if (!fuelType || !pricePerLiter) {
                return res.status(400).json({
                    success: false,
                    message: 'Fuel type and price are required'
                });
            }

            const updatedPrice = await FuelPrice.updatePrice(fuelType, pricePerLiter);
            
            res.status(200).json({
                success: true,
                message: 'Price updated successfully',
                data: updatedPrice
            });
        } catch (error) {
            console.error('Error in updatePrice:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

module.exports = fuelPriceController; 