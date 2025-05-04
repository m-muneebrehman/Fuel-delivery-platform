const express = require('express');
const router = express.Router();
const mapsService = require('../services/maps.service');

router.get('/address-coordinates', async (req, res) => {
    try {
        const { address } = req.query;
        const coordinates = await mapsService.getAddressCoordinate(address);
        res.json(coordinates);
    } catch (error) {
        console.error('Error in address-coordinates route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/location-suggestions', async (req, res) => {
    try {
        const { query } = req.query;
        const suggestions = await mapsService.getLocationSuggestions(query);
        res.json(suggestions);
    } catch (error) {
        console.error('Error in location-suggestions route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/distance', async (req, res) => {
    try {
        const { origin, destination } = req.query;
        const distance = await mapsService.getDistance(origin, destination);
        res.json(distance);
    } catch (error) {
        console.error('Error in distance route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/nearby-registered-fuel-pumps', async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;
        
        // This will get fuel pumps only from our database within the radius
        const nearbyFuelPumps = await mapsService.getNearbyRegisteredFuelPumps({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radiusInKm: parseFloat(radius)
        });
        
        res.json(nearbyFuelPumps);
    } catch (error) {
        console.error('Error in nearby-registered-fuel-pumps route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router;