const fuelPumpService = require("../services/fuelPump.service");
const { validationResult ,cookie} = require("express-validator");
const fuelPumpModel = require("../models/fuelPump.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const mapsService = require("../services/maps.service");

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

   
    // Get coordinates from Google Maps API
    // const location_detail = await mapsService.getAddressCoordinate(location);

    console.log('The issue is here');

    // Format location object according to schema
    // const locationData = {
    //     type: 'Point',
    //     coordinates: [location_detail.lng, location_detail.lat], // MongoDB expects [longitude, latitude]
    //     address: location
    // };

    const hashedPassword = await fuelPumpModel.hashPassword(password);

    const fuelPump = await fuelPumpService.createFuelPump({ 
        name, 
        email, 
        password: hashedPassword, 
        location : location
    });

    // const token = fuelPump.generateAuthToken();

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

    // const token = fuelPump.generateAuthToken();
    // res.cookie("token", token);

    res.status(200).json({ fuelPump });
    
    
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

