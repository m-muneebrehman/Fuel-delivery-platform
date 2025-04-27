const deliveryBoyService = require("../services/deliveryBoy.service");
const {validationResult, cookie} = require("express-validator");
const deliveryBoyModel = require("../models/deliveryBoy.model");
const authMiddleware = require("../middlewares/auth.middleware");
const blacklistTokenModel = require("../models/blacklistToken.model");


module.exports.registerDeliveryBoy = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullName,email,password,phoneNumber,cnicNumber,photo,address,fuelPump} = req.body;

    const isDeliveryBoyExist = await deliveryBoyModel.findOne({email});

    if(isDeliveryBoyExist){
        return res.status(400).json({message:"Delivery boy already exists"});
    }

    const hashedPassword = await deliveryBoyModel.hashPassword(password);

    const deliveryBoy = await deliveryBoyService.createDeliveryBoy({fullName,email,password:hashedPassword,phoneNumber,cnicNumber,photo,address,fuelPump});

    const token = deliveryBoy.generateAuthToken();

    res.cookie("token",token);

    res.status(201).json({token,deliveryBoy});
    
    
    
};

module.exports.loginDeliveryBoy = async(req,res,next)=>{

    const errors = validationResult(req);

    if(!errors){
        return  res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body;

    const deliveryBoy = await deliveryBoyModel.findOne({email}).select("+password");

    if(!deliveryBoy){
        return res.status(401).json({message: "Invalid email or password" });
    }

    const isMatch = await deliveryBoy.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }

    const token = deliveryBoy.generateAuthToken();

    res.cookie("token",token);

    res.status(200).json({token,deliveryBoy})
};

module.exports.getDeliveryBoyProfile = async(req,res,next)=>{
    res.status(200).json(req.deliveryBoy)
};

module.exports.logoutDeliveryBoy = async(req,res,next)=>{
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blacklistTokenModel.create({ token });
    
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};