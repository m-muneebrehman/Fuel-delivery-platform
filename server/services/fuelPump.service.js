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

// module.exports.verifyFuelPump = async({fuelPumpId})=>{
//     const fuelPump = await FuelPumpModel.findById(fuelPumpId);
//     if(!fuelPump){
//         throw new Error("Fuel pump not found");
//     }
    
//     fuelPump.isVerified = true;
//     await fuelPump.save();

//     return fuelPump;
// };


