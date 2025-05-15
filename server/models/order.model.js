const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
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
            lat: Number,
            lng: Number
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit-card', 'debit-card', 'upi', 'net-banking'],
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryTimeSlot: {
        start: String,
        end: String
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy'
    },
    deliveryBoyLocation: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        heading: Number, // Direction in degrees
        speed: Number,   // Speed in km/h
        accuracy: Number // Location accuracy in meters
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
