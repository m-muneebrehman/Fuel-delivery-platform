const fuelPumpService = require("../services/fuelPump.service");
const { validationResult, cookie } = require("express-validator");
const fuelPumpModel = require("../models/fuelPump.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const mapsService = require("../services/maps.service")
const jwt = require("jsonwebtoken");

module.exports.registerFuelPump = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, location } = req.body;

    console.log('location', location);

    const isFuelPumpExist = await fuelPumpModel.findOne({ email });
    if(isFuelPumpExist) {
        return res.status(400).json({ message: "Fuel pump already exists" });
    }

    console.log('It was fine here');

    const hashedPassword = await fuelPumpModel.hashPassword(password);

    const fuelPump = await fuelPumpService.createFuelPump({ 
        name, 
        email, 
        password: hashedPassword, 
        location : location
    });

    res.status(201).json({ fuelPump, fuelPumpId: fuelPump._id });
}

module.exports.loginFuelPump = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const fuelPump = await fuelPumpModel.findOne({ email }).select("+password");

    if(!fuelPump) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    if(fuelPump.isVerified === false) {
        return res.status(200).json({ verified: fuelPump.isVerified });
    }

    const isMatch = await fuelPump.comparePassword(password);

    if(!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign({ _id: fuelPump._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    // Return only necessary data and token
    res.status(200).json({
        token,
        ownerId: fuelPump._id,
        verified: fuelPump.isVerified
    });
}

module.exports.getFuelPumpProfile = async (req, res, next) => {
    res.status(200).json(req.fuelPump);
}

module.exports.logoutFuelPump = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blacklistTokenModel.create({ token });
    
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

// New controller functions for handling fuel pump requests

// Get all fuel pump requests
module.exports.getFuelPumpRequests = async (req, res) => {
    try {
        const requests = await fuelPumpService.getFuelPumpRequests();
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Approve a fuel pump request
module.exports.approveFuelPump = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelPump = await fuelPumpService.approveFuelPump(id);
        res.status(200).json({
            success: true,
            message: 'Fuel pump request approved successfully',
            data: fuelPump
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Reject a fuel pump request
module.exports.rejectFuelPump = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelPump = await fuelPumpService.rejectFuelPump(id);
        res.status(200).json({
            success: true,
            message: 'Fuel pump request rejected successfully',
            data: fuelPump
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

