const mongoose = require('mongoose');
const testData = require('./fuelOrder.test.data');
const userModel = require('../models/user.model');
const fuelPumpModel = require('../models/fuelPump.model');
const deliveryBoyModel = require('../models/deliveryBoy.model');
const fuelOrderModel = require('../models/fuelOrder.model');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            userModel.deleteMany({}),
            fuelPumpModel.deleteMany({}),
            deliveryBoyModel.deleteMany({}),
            fuelOrderModel.deleteMany({})
        ]);
        console.log('Cleared existing data');

        // Insert users
        const users = await userModel.insertMany(testData.users);
        console.log('Inserted users');

        // Insert fuel pumps
        const fuelPumps = await fuelPumpModel.insertMany(testData.fuelPumps);
        console.log('Inserted fuel pumps');

        // Insert delivery boys
        const deliveryBoys = await deliveryBoyModel.insertMany(testData.deliveryBoys);
        console.log('Inserted delivery boys');

        // Insert fuel orders
        const fuelOrders = await fuelOrderModel.insertMany(testData.fuelOrders);
        console.log('Inserted fuel orders');

        console.log('Database seeded successfully!');
        console.log('\nTest Data Summary:');
        console.log('------------------');
        console.log(`Users: ${users.length}`);
        console.log(`Fuel Pumps: ${fuelPumps.length}`);
        console.log(`Delivery Boys: ${deliveryBoys.length}`);
        console.log(`Fuel Orders: ${fuelOrders.length}`);
        console.log('\nTest Tokens:');
        console.log('------------');
        console.log('User Token:', testData.tokens.userToken);
        console.log('Admin Token:', testData.tokens.adminToken);
        console.log('Delivery Boy Token:', testData.tokens.deliveryBoyToken);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seeding function
seedDatabase(); 