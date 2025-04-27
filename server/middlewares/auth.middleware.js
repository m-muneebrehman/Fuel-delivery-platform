const userModel = require("../models/user.model");
const fuelPumpModel = require("../models/fuelPump.model");
const deliveryBoyModel = require('../models/deliveryBoy.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const isBlackListed = await blacklistTokenModel.findOne({token:token});

  if(isBlackListed){
    return res.status(401).json({message:"Unauthorized 2"});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized 3" });
  }
};

module.exports.authFuelPump = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const isBlackListed = await blacklistTokenModel.findOne({token:token});

  if(isBlackListed){
    return res.status(401).json({message:"Unauthorized 2"});
  }

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fuelPump = await fuelPumpModel.findById(decoded._id);
    req.fuelPump = fuelPump;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized 3" });
  }
  
};

module.exports.authDeliveryBoy = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const isBlackListed = await blacklistTokenModel.findOne({token:token});

  if(isBlackListed){
    return res.status(401).json({message:"Unauthorized 2"});
  }

  try {   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deliveryBoy = await deliveryBoyModel.findById(decoded._id);
    req.deliveryBoy = deliveryBoy;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized 3" });
  }
  
}


