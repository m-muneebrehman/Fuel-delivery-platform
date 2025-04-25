const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const fuelPumpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Fuel pump name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Email must be at least 5 characters long"],
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    location: {
        type: String,
        required: true,
        },
       
    fuelAvailable: {
      petrol: {
        type: Number,
        default: 0,
      },
      diesel: {
        type: Number,
        default: 0,
      },
      hioctane: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);


fuelPumpSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
    return token;
}

fuelPumpSchema.methods.comparePassword = async function (password)  {
    return await bcrypt.compare(password,this.password);
}

fuelPumpSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}

const fuelPumpModel = mongoose.model('fuelPump',fuelPumpSchema)

module.exports=fuelPumpModel;