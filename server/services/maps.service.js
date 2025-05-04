const axios = require('axios');
const config = require('../config/config');

class MapsService {
    // Constants
    static BASE_FARE = 5.00;
    static PER_KM_RATE = 2.00;
    static MINIMUM_DISTANCE = 2; // in kilometers
    static EARTH_RADIUS = 6371; // in kilometers
    static DEFAULT_RADIUS = 5000; // in meters

    /**
     * Calculate delivery fare based on distance and current conditions
     * @param {Object} origin - Origin coordinates {latitude, longitude}
     * @param {Object} destination - Destination coordinates {latitude, longitude}
     * @returns {Promise<number>} - Calculated fare
     */
    static async calculateDeliveryFare(origin, destination) {
        try {
            const distance = await this.calculateDistance(origin, destination);
            const surgeMultiplier = await this.getSurgeMultiplier();
            
            let fare = this.BASE_FARE;
            if (distance > this.MINIMUM_DISTANCE) {
                fare += (distance - this.MINIMUM_DISTANCE) * this.PER_KM_RATE;
            }
            
            fare *= surgeMultiplier;
            return this.roundToTwoDecimals(fare);
        } catch (error) {
            throw new Error(`Failed to calculate delivery fare: ${error.message}`);
        }
    }

    /**
     * Calculate distance between two points using Haversine formula
     * @param {Object} origin - Origin coordinates {latitude, longitude}
     * @param {Object} destination - Destination coordinates {latitude, longitude}
     * @returns {number} - Distance in kilometers
     */
    static calculateDistance(origin, destination) {
        const lat1 = this.degreesToRadians(origin.latitude);
        const lat2 = this.degreesToRadians(destination.latitude);
        const deltaLat = this.degreesToRadians(destination.latitude - origin.latitude);
        const deltaLon = this.degreesToRadians(destination.longitude - origin.longitude);

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return this.EARTH_RADIUS * c;
    }

    /**
     * Get surge multiplier based on current conditions
     * @returns {number} - Surge multiplier
     */
    static async getSurgeMultiplier() {
        const hour = new Date().getHours();
        // Evening rush hour (5 PM - 7 PM)
        if (hour >= 17 && hour <= 19) {
            return 1.5;
        }
        return 1.0;
    }

    /**
     * Get route information between two points
     * @param {Object} origin - Origin coordinates {latitude, longitude}
     * @param {Object} destination - Destination coordinates {latitude, longitude}
     * @returns {Promise<Object>} - Route information
     */
    static async getRoute(origin, destination) {
        try {
            const distance = await this.calculateDistance(origin, destination);
            const duration = distance * 2; // Assuming average speed of 30 km/h

            return {
                distance: {
                    text: `${this.roundToTwoDecimals(distance)} km`,
                    value: Math.round(distance * 1000) // Convert to meters
                },
                duration: {
                    text: `${Math.round(duration)} mins`,
                    value: Math.round(duration * 60) // Convert to seconds
                },
                route: this.generateRoutePoints(origin, destination)
            };
        } catch (error) {
            throw new Error(`Failed to get route: ${error.message}`);
        }
    }

    /**
     * Get nearby fuel pumps within specified radius
     * @param {Object} location - Center coordinates {latitude, longitude}
     * @param {number} radius - Search radius in meters
     * @returns {Promise<Array>} - List of nearby fuel pumps
     */
    static async getNearbyFuelPumps(location, radius = this.DEFAULT_RADIUS) {
        try {
            // In production, this would use a real API or database query
            return this.generateMockFuelPumps(location, radius);
        } catch (error) {
            throw new Error(`Failed to get nearby fuel pumps: ${error.message}`);
        }
    }

    // Helper methods
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static roundToTwoDecimals(number) {
        return Math.round(number * 100) / 100;
    }

    static generateRoutePoints(origin, destination) {
        return [
            origin,
            {
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2
            },
            destination
        ];
    }

    static generateMockFuelPumps(location, radius) {
        return [
            {
                id: "pump1",
                location: "Downtown Gas Station",
                address: "100 Main St, City, State 12345",
                coordinates: {
                    latitude: location.latitude + 0.01,
                    longitude: location.longitude + 0.01
                },
                distance: {
                    text: "1.2 km",
                    value: 1200
                },
                fuelTypes: ["Regular", "Premium", "Diesel"],
                status: "operational"
            }
        ];
    }
}

module.exports = MapsService;
