// models/inventory.model.js
const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"]
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Engine Parts', 'Brake System', 'Transmission', 'Electrical', 'Suspension', 'Body Parts', 'Filters', 'Other']
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0
    },
    manufacturer: {
      type: String,
      required: true
    },
    compatibleVehicles: [{
      make: String,
      model: String,
      year: Number
    }],
    images: [{
      type: String,
      required: false
    }],
    specifications: {
      type: Map,
      of: String
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    warranty: {
      duration: Number, // in months
      description: String
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Adding indexes for common queries
inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ manufacturer: 1 });
inventorySchema.index({ sku: 1 }, { unique: true });
inventorySchema.index({ 'compatibleVehicles.make': 1, 'compatibleVehicles.model': 1, 'compatibleVehicles.year': 1 });

// Create the model - Fixed from original code
const inventoryModel = mongoose.model('Inventory', inventorySchema);

module.exports = inventoryModel;