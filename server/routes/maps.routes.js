const express = require('express');
const router = express.Router();
const MapsService = require('../services/maps.service');
const { authMiddleware } = require('../middlewares/auth.middleware')
const axios = require('axios');

// Calculate delivery fare
router.post('/calculate-fare', authMiddleware, async (req, res) => {
    try {
        const { origin, destination } = req.body;
        
        // Validate input
        if (!origin || !destination || 
            !origin.latitude || !origin.longitude || 
            !destination.latitude || !destination.longitude) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates provided. Both origin and destination must include latitude and longitude.'
            });
        }

        // Calculate fare using MapsService
        const fare = await MapsService.calculateDeliveryFare(origin, destination);
        
        // Return response with fare
        res.json({
            success: true,
            data: {
                fare,
                currency: 'PKR',
                details: {
                    baseFare: MapsService.BASE_FARE,
                    perKmRate: MapsService.PER_KM_RATE,
                    minimumDistance: MapsService.MINIMUM_DISTANCE
                }
            }
        });
    } catch (error) {
        console.error('Error calculating fare:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate delivery fare',
            error: {
                code: 'FARE_CALCULATION_ERROR',
                details: error.message
            }
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

// Endpoint to get address suggestions
router.get('/autocomplete', async (req, res) => {
    const { input } = req.query;
  
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          input,
          key: process.env.GOOGLE_API_KEY,
          types: 'geocode', // restrict to addresses
          language: 'en'
        }
      });
  
      const suggestions = response.data.predictions.map((prediction) => ({
        description: prediction.description,
        placeId: prediction.place_id
      }));
  
      res.json({ suggestions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch suggestions" });
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