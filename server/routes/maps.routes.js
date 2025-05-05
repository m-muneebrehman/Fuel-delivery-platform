const express = require('express');
const router = express.Router();
const MapsService = require('../services/maps.service');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Calculate delivery fare
router.post('/calculate-fare', authMiddleware, async (req, res) => {
    try {
        const { origin, destination } = req.body;
        const fare = await MapsService.calculateDeliveryFare(origin, destination);
        res.json({
            success: true,
            data: { fare }
        });
    } catch (error) {
        console.error('Error calculating fare:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get route information
router.post('/route', authMiddleware, async (req, res) => {
    try {
        const { origin, destination } = req.body;
        const route = await MapsService.getRoute(origin, destination);
        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        console.error('Error getting route:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get nearby fuel pumps
router.get('/nearby-pumps', authMiddleware, async (req, res) => {
    try {
        const { location, radius } = req.query;
        const pumps = await MapsService.getNearbyFuelPumps(
            JSON.parse(location),
            parseInt(radius) || MapsService.DEFAULT_RADIUS
        );
        res.json({
            success: true,
            data: pumps
        });
    } catch (error) {
        console.error('Error getting nearby pumps:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;