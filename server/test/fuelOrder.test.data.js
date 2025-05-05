const testData = {
    // Test user data
    users: [
        {
            _id: "user1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            address: "123 Main St, City",
            role: "user",
            status: "active"
        },
        {
            _id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+1987654321",
            address: "456 Oak Ave, Town",
            role: "user",
            status: "active"
        }
    ],

    // Test fuel pumps data
    fuelPumps: [
        {
            _id: "pump1",
            name: "City Center Fuel Station",
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760] // Mumbai coordinates
            },
            address: "789 Fuel St, Mumbai",
            fuelTypes: ["petrol", "diesel"],
            prices: {
                petrol: 96.72,
                diesel: 89.62
            },
            status: "active"
        },
        {
            _id: "pump2",
            name: "Highway Fuel Stop",
            location: {
                type: "Point",
                coordinates: [72.8857, 19.0760] // Nearby Mumbai coordinates
            },
            address: "321 Highway Rd, Mumbai",
            fuelTypes: ["petrol", "diesel", "cng"],
            prices: {
                petrol: 96.72,
                diesel: 89.62,
                cng: 75.00
            },
            status: "active"
        }
    ],

    // Test delivery boys data
    deliveryBoys: [
        {
            _id: "delivery1",
            name: "Raj Kumar",
            phone: "+911234567890",
            vehicleNumber: "MH01AB1234",
            status: "active",
            currentLocation: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            }
        },
        {
            _id: "delivery2",
            name: "Amit Singh",
            phone: "+911987654321",
            vehicleNumber: "MH02CD5678",
            status: "active",
            currentLocation: {
                type: "Point",
                coordinates: [72.8857, 19.0760]
            }
        }
    ],

    // Test fuel orders data
    fuelOrders: [
        {
            _id: "order1",
            userId: "user1",
            fuelPumpId: "pump1",
            fuelType: "petrol",
            quantity: 10, // in liters
            totalAmount: 967.20,
            deliveryAddress: "123 Main St, City",
            status: "pending",
            createdAt: new Date(),
            paymentStatus: "pending",
            paymentMethod: "online"
        },
        {
            _id: "order2",
            userId: "user2",
            fuelPumpId: "pump2",
            fuelType: "diesel",
            quantity: 15,
            totalAmount: 1344.30,
            deliveryAddress: "456 Oak Ave, Town",
            status: "confirmed",
            deliveryBoyId: "delivery1",
            createdAt: new Date(),
            paymentStatus: "completed",
            paymentMethod: "cash"
        },
        {
            _id: "order3",
            userId: "user1",
            fuelPumpId: "pump1",
            fuelType: "petrol",
            quantity: 5,
            totalAmount: 483.60,
            deliveryAddress: "123 Main St, City",
            status: "in_progress",
            deliveryBoyId: "delivery2",
            createdAt: new Date(),
            paymentStatus: "completed",
            paymentMethod: "online"
        },
        {
            _id: "order4",
            userId: "user2",
            fuelPumpId: "pump2",
            fuelType: "cng",
            quantity: 8,
            totalAmount: 600.00,
            deliveryAddress: "456 Oak Ave, Town",
            status: "completed",
            deliveryBoyId: "delivery1",
            createdAt: new Date(),
            paymentStatus: "completed",
            paymentMethod: "online"
        },
        {
            _id: "order5",
            userId: "user1",
            fuelPumpId: "pump1",
            fuelType: "diesel",
            quantity: 20,
            totalAmount: 1792.40,
            deliveryAddress: "123 Main St, City",
            status: "cancelled",
            createdAt: new Date(),
            paymentStatus: "refunded",
            paymentMethod: "online"
        }
    ],

    // Test tokens for authentication
    tokens: {
        userToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ1c2VyMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ",
        adminToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9",
        deliveryBoyToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJkZWxpdmVyeTEiLCJyb2xlIjoiZGVsaXZlcnlfYm95IiwiaWF0IjoxNTE2MjM5MDIyfQ"
    }
};

module.exports = testData; 