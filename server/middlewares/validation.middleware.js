const Joi = require('joi');

// Order validation schema
const orderSchema = Joi.object({
    fuelType: Joi.string().required().valid('petrol', 'diesel', 'cng'),
    quantity: Joi.number().required().min(1).max(100),
    deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required().pattern(/^\d{6}$/),
        coordinates: Joi.object({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        }).required()
    }).required(),
    paymentMethod: Joi.string().required().valid('cash', 'card', 'upi'),
    fuelPump: Joi.string().required(), // Fuel pump ID
    deliveryTime: Joi.date().min('now').required(),
    specialInstructions: Joi.string().max(200).allow('', null)
});

/**
 * Validate order data
 * @param {Object} orderData - Order data to validate
 * @returns {string|null} - Error message if validation fails, null if successful
 */
const validateOrder = (orderData) => {
    const { error } = orderSchema.validate(orderData, { abortEarly: false });
    
    if (error) {
        // Format validation errors into a readable message
        const errorMessage = error.details
            .map(detail => detail.message)
            .join(', ');
        return errorMessage;
    }
    
    return null;
};

module.exports = {
    validateOrder
}; 