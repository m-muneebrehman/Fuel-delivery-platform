const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const deliveryBoySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{11}$/, "Please enter a valid 11-digit phone number"],
    },
    cnicNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{5}-\d{7}-\d$/, "Please enter CNIC in format: 12345-1234567-1"],
    },
    address: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    fuelPump: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fuelPump",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

deliveryBoySchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
    return token;
}

deliveryBoySchema.methods.comparePassword = async function (password)  {
    return await bcrypt.compare(password,this.password);
}

deliveryBoySchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}

const DeliveryBoyModel = mongoose.model("DeliveryBoy", deliveryBoySchema);

module.exports = DeliveryBoyModel;
