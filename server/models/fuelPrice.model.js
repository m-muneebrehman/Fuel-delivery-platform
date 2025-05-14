const mongoose = require('mongoose');

const fuelPriceSchema = new mongoose.Schema({
  fuelType: {
    type: String,
    required: true,
    enum: ['Regular', 'Premium', 'Diesel'],
    unique: true
  },
  pricePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a method to get all fuel prices
fuelPriceSchema.statics.getAllPrices = async function() {
  const prices = await this.find({});
  return prices;
};

// Add a method to update a fuel price
fuelPriceSchema.statics.updatePrice = async function(fuelType, pricePerLiter) {
  const updated = await this.findOneAndUpdate(
    { fuelType },
    { pricePerLiter, updatedAt: Date.now() },
    { new: true, upsert: true }
  );
  return updated;
};

const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema);

// Initialize with default prices if none exist
const initializeDefaultPrices = async () => {
  try {
    const count = await FuelPrice.countDocuments();
    if (count === 0) {
      await FuelPrice.create([
        { fuelType: 'Regular', pricePerLiter: 272.89 },
        { fuelType: 'Premium', pricePerLiter: 210.30 },
        { fuelType: 'Diesel', pricePerLiter: 278.91 }
      ]);
      console.log('Default fuel prices initialized');
    }
  } catch (error) {
    console.error('Error initializing fuel prices:', error);
  }
};

// Call the initialization function
initializeDefaultPrices();

module.exports = FuelPrice; 