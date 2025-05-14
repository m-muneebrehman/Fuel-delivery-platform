const express = require('express');
const router = express.Router();
const MapsService = require('../services/maps.service');

// Calculate delivery fare
router.post('/calculate-delivery-fare', async (req, res) => {
    try {
        const { origin, destination } = req.body;
        
        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Origin and destination coordinates are required'
            });
        }

        const fare = await MapsService.calculateDeliveryFare(origin, destination);
        
        res.json({
            success: true,
            fare: fare
        });
    } catch (error) {
        console.error('Error calculating delivery fare:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate delivery fare'
        });
    }
});

// ... other routes ...

module.exports = router; 