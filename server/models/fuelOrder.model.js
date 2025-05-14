const mongoose = require('mongoose');

const fuelOrderSchema = new mongoose.Schema({
  otp:{
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  fuelPump: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fuelPump',
    required: true
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryBoy'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'assigned', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  fuelType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  deliveryFare: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FuelOrder', fuelOrderSchema);
