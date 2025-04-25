const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
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
    },
    license: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    fuelPump: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fuelPump",
      required: true,
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


const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

module.exports = DeliveryBoy;
