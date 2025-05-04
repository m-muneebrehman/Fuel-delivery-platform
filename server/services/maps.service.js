module.exports.getAddressCoordinate = async(address)=>{
  try {
    const axios = require('axios');
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Make request to Google Geocoding API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`
    );

    // Check if we got results
    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      
      return {
        lat: location.lat,
        lng: location.lng
      };
    }

    throw new Error('No coordinates found for this address');
    
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}


module.exports.getLocationSuggestions = async (query) => {
  try {
    const axios = require('axios');
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    // Make request to Google Places Autocomplete API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedQuery}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.predictions) {
      return response.data.predictions.map(prediction => ({
        description: prediction.description,
        placeId: prediction.place_id
      }));
    }

    return [];

  } catch (error) {
    console.error('Error getting location suggestions:', error);
    throw error;
  }
};

module.exports.getDistance = async (origin, destination) => {
  try {
    const axios = require('axios');
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    // Encode the addresses for URL
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);
    
    // Make request to Google Distance Matrix API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.rows && response.data.rows[0].elements) {
      const element = response.data.rows[0].elements[0];
      return {
        distance: element.distance,
        duration: element.duration
      };
    }

    throw new Error('Could not calculate distance between these points');

  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
};

module.exports.getNearbyRegisteredFuelPumps = async ({ latitude, longitude, radiusInKm }) => {
  try {
    // This would typically involve a database query using geospatial queries
    // Example using MongoDB:
    const FuelPump = require('../models/fuelPump.model');
    
    // This MongoDB query finds fuel pumps within a radius of the given coordinates
    // 1. location field must have a geospatial index defined in the schema
    // 2. $near operator finds documents with coordinates near the given point
    // 3. $geometry specifies the GeoJSON Point with [longitude, latitude] coordinates
    // 4. $maxDistance is in meters, so we multiply radiusInKm by 1000
    const nearbyPumps = await FuelPump.find({
      location: {
        $near: {
          $geometry: {
            type: "Point", 
            coordinates: [longitude, latitude] // MongoDB expects [long, lat] order
          },
          $maxDistance: radiusInKm * 1000 // Convert kilometers to meters
        }
      }
    });

    return nearbyPumps;

  } catch (error) {
    console.error('Error finding nearby fuel pumps:', error);
    throw error;
  }
};
