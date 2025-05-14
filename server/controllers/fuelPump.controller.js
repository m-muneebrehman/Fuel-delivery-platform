const fuelPumpService = require("../services/fuelPump.service");
const { validationResult, cookie } = require("express-validator");
const fuelPumpModel = require("../models/fuelPump.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const mapsService = require("../services/maps.service")
const jwt = require("jsonwebtoken");
const DeliveryBoyModel = require("../models/deliveryBoy.model");

module.exports.registerFuelPump = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, location } = req.body;
        
        // Check if fuel pump already exists
        const existingPump = await fuelPumpModel.findOne({ email });
        if (existingPump) {
            return res.status(400).json({
                success: false,
                message: 'Fuel pump with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await fuelPumpModel.hashPassword(password);
        
        // Create new fuel pump
        const fuelPump = new fuelPumpModel({
            name,
            email,
            password: hashedPassword,
            location
        });

        await fuelPump.save();

        // Generate auth token
        const token = fuelPump.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Fuel pump registered successfully',
            data: {
                _id: fuelPump._id,
                name: fuelPump.name,
                email: fuelPump.email,
                location: fuelPump.location,
                token
            }
        });
    } catch (error) {
        console.error('Error in registerFuelPump:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.loginFuelPump = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find fuel pump and include password for verification
        const fuelPump = await fuelPumpModel.findOne({ email }).select('+password');
        if (!fuelPump) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isPasswordValid = await fuelPump.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = fuelPump.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: fuelPump._id,
                name: fuelPump.name,
                email: fuelPump.email,
                location: fuelPump.location,
                token
            }
        });
    } catch (error) {
        console.error('Error in loginFuelPump:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.getFuelPumpProfile = async (req, res, next) => {
    try {
        const fuelPump = await fuelPumpModel.findById(req.user._id);
        if (!fuelPump) {
            return res.status(404).json({
                success: false,
                message: 'Fuel pump not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fuelPump
        });
    } catch (error) {
        console.error('Error in getFuelPumpProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.logoutFuelPump = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Error in logoutFuelPump:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// New controller functions for handling fuel pump requests

// Get all fuel pump requests
module.exports.getFuelPumpRequests = async (req, res) => {
    try {
        const unverifiedPumps = await fuelPumpModel.find({ isVerified: false });
        res.status(200).json({
            success: true,
            data: unverifiedPumps
        });
    } catch (error) {
        console.error('Error in getFuelPumpRequests:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Approve a fuel pump request
module.exports.approveFuelPump = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelPump = await fuelPumpModel.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        if (!fuelPump) {
            return res.status(404).json({
                success: false,
                message: 'Fuel pump not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fuel pump approved successfully',
            data: fuelPump
        });
    } catch (error) {
        console.error('Error in approveFuelPump:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Reject a fuel pump request
module.exports.rejectFuelPump = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelPump = await fuelPumpModel.findByIdAndDelete(id);

        if (!fuelPump) {
            return res.status(404).json({
                success: false,
                message: 'Fuel pump not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Fuel pump rejected and removed successfully'
        });
    } catch (error) {
        console.error('Error in rejectFuelPump:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get all delivery boys associated with the authenticated fuel pump
 */
module.exports.getMyDeliveryBoys = async (req, res) => {
    try {
        // Get the fuel pump ID from the authenticated user
        const fuelPumpId = req.fuelPump._id;
        
        // Find all available delivery boys associated with this fuel pump
        const deliveryBoys = await DeliveryBoyModel.find({ 
            fuelPump: fuelPumpId,
            status: 'available'  // Only get available delivery boys
        }).select('-password');
        
        res.status(200).json({
            success: true,
            count: deliveryBoys.length,
            data: deliveryBoys
        });
    } catch (error) {
        console.error('Error fetching delivery boys:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching delivery boys',
            error: error.message
        });
    }
};

// Get all verified fuel pumps
module.exports.getVerifiedFuelPumps = async (req, res) => {
    try {
        const verifiedPumps = await fuelPumpModel.find({ isVerified: true });
        res.status(200).json({
            success: true,
            data: verifiedPumps
        });
    } catch (error) {
        console.error('Error in getVerifiedFuelPumps:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

