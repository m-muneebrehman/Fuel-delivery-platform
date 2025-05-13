const FuelPumpModel = require("../models/fuelPump.model");

module.exports.createFuelPump = async({
    name,email,password,location
})=>{

    if(!name || !email || !password || !location){
        throw new Error("All fields are required");
    }

    const fuelPump = await FuelPumpModel.create({
        name,email,password,location
    })

    return fuelPump;
};

// Get all fuel pump requests
module.exports.getFuelPumpRequests = async () => {
    const requests = await FuelPumpModel.find({ isVerified: false })
        .select('-password')
        .sort({ createdAt: -1 });
    return requests;
};

// Approve a fuel pump request
module.exports.approveFuelPump = async (fuelPumpId) => {
    const fuelPump = await FuelPumpModel.findById(fuelPumpId);
    if (!fuelPump) {
        throw new Error("Fuel pump not found");
    }

    fuelPump.isVerified = true;
    fuelPump.status = 'approved';
    await fuelPump.save();

    return fuelPump;
};

// Reject a fuel pump request
module.exports.rejectFuelPump = async (fuelPumpId) => {
    const fuelPump = await FuelPumpModel.findById(fuelPumpId);
    if (!fuelPump) {
        throw new Error("Fuel pump not found");
    }

    fuelPump.status = 'rejected';
    await fuelPump.save();

    return fuelPump;
};


