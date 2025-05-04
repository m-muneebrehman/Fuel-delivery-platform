module.exports = {
    // Test user credentials
    testUser: {
        email: "testuser@example.com",
        password: "Test@123",
        name: "Test User",
        phone: "1234567890"
    },

    // Test admin credentials
    testAdmin: {
        email: "admin@example.com",
        password: "Admin@123",
        name: "Admin User",
        phone: "9876543210",
        role: "admin"
    },

    // Test delivery boy credentials
    testDeliveryBoy: {
        email: "delivery@example.com",
        password: "Delivery@123",
        name: "Delivery Boy",
        phone: "5555555555",
        role: "delivery"
    },

    // Test fuel pump data
    testFuelPump: {
        name: "Test Fuel Station",
        address: "123 Test Street, Test City",
        coordinates: {
            latitude: 12.9716,
            longitude: 77.5946
        },
        fuelTypes: ["Regular", "Premium", "Diesel"],
        status: "operational"
    },

    // Test fuel order data
    testOrder: {
        fuelType: "Regular",
        quantity: 10,
        deliveryAddress: {
            street: "456 Delivery Street",
            city: "Test City",
            state: "Test State",
            zipCode: "12345",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            }
        },
        paymentMethod: "credit_card",
        specialInstructions: "Test delivery instructions"
    },

    // Test fare calculation data
    testFareCalculation: {
        origin: {
            latitude: 12.9716,
            longitude: 77.5946
        },
        destination: {
            latitude: 12.9352,
            longitude: 77.6245
        }
    },

    // Test nearby pumps search
    testLocation: {
        latitude: 12.9716,
        longitude: 77.5946
    }
}; 