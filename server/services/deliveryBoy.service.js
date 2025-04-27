const DeliveryBoyModel = require("../models/deliveryBoy.model");

module.exports.createDeliveryBoy = async({
    fullName,
    email,
    password,
    phoneNumber,
    cnicNumber,
    photo,
    address,
    fuelPump    
})=>{
    if(!fullName || !email || !password || !phoneNumber || !cnicNumber || !photo || !address || !fuelPump){
        throw new Error("All fields are required");
    }

    const deliveryBoy = await DeliveryBoyModel.create({
        fullName,
        email,
        password,
        phoneNumber,
        cnicNumber,
        photo,
        address,
        fuelPump
    })

    return deliveryBoy;
};


module.exports.verifyDeliveryBoy = async({deliveryBoyId})=>{
    const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);
    if(!deliveryBoy){
        throw new Error("Delivery boy not found");
    }

    deliveryBoy.isVerified = true;
    await deliveryBoy.save();

    return deliveryBoy;
};



