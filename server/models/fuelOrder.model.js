const mongoose = require('mongoose');

const fuelOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fuelPump: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FuelPump',
    required: true
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
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
