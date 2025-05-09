// File: controllers/orderController.js
const Order = require('../models/order.model.js');
const Inventory = require('../models/inventory.model.js'); // Assuming you have an Inventory model

// Helper function to validate order data
const validateOrder = (orderData) => {
  // Check for required fields
  if (!orderData.user) return 'User ID is required';
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return 'At least one item is required';
  }
  
  // Validate each item
  for (const item of orderData.items) {
    if (!item.itemId) return 'Item ID is required';
    if (!item.name) return 'Item name is required';
    if (!item.quantity || item.quantity <= 0) return 'Valid quantity is required';
    if (!item.price || item.price <= 0) return 'Valid price is required';
  }
  
  // Validate totalAmount
  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    return 'Valid total amount is required';
  }
  
  // Validate delivery address
  if (!orderData.deliveryAddress || !orderData.deliveryAddress.street || 
      !orderData.deliveryAddress.city || !orderData.deliveryAddress.state || 
      !orderData.deliveryAddress.zipCode) {
    return 'Complete delivery address is required';
  }
  
  // Validate payment method
  if (!orderData.paymentMethod || !['credit-card', 'debit-card', 'upi', 'net-banking'].includes(orderData.paymentMethod)) {
    return 'Valid payment method is required';
  }
  
  // Validate delivery date
  if (!orderData.deliveryDate) {
    return 'Delivery date is required';
  }
  
  // Validate delivery time slot
  if (!orderData.deliveryTimeSlot || !orderData.deliveryTimeSlot.start || !orderData.deliveryTimeSlot.end) {
    return 'Delivery time slot is required';
  }
  
  return null; // No validation errors
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Extract user ID from request (could be from JWT token or from request body)
    const userId = req.user?._id || req.body.user;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Prepare order data
    const orderData = {
      ...req.body,
      user: userId,
      status: 'pending',
      paymentStatus: 'pending'
    };
    
    // Validate the order data
    const validationError = validateOrder(orderData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    
    // Calculate total amount if not provided or to verify the provided total
    let calculatedTotal = 0;
    for (const item of orderData.items) {
      calculatedTotal += item.price * item.quantity;
    }
    
    // Check if calculated total matches the provided total
    if (Math.abs(calculatedTotal - orderData.totalAmount) > 0.01) {
      return res.status(400).json({ 
        error: 'Total amount mismatch', 
        expected: calculatedTotal, 
        provided: orderData.totalAmount 
      });
    }
    
    // Check inventory availability (optional, but recommended)
    for (const item of orderData.items) {
      try {
        const inventoryItem = await Inventory.findById(item.itemId);
        if (!inventoryItem || inventoryItem.quantity < item.quantity) {
          return res.status(400).json({ 
            error: `Item ${item.name} is out of stock or has insufficient quantity` 
          });
        }
      } catch (err) {
        console.error(`Error checking inventory for item ${item.itemId}:`, err);
        // Continue processing if inventory check fails - you may want to handle this differently
      }
    }
    
    // Create and save the new order
    const order = new Order(orderData);
    await order.save();
    
    // Update inventory quantities (optional, but recommended)
    try {
      for (const item of orderData.items) {
        await Inventory.findByIdAndUpdate(
          item.itemId,
          { $inc: { quantity: -item.quantity } }
        );
      }
    } catch (err) {
      console.error('Error updating inventory quantities:', err);
      // Consider how to handle inventory update failures (e.g., rollback the order)
    }
    
    // Here you would typically integrate with a payment gateway
    // This is a placeholder for payment processing
    
    // Return the created order
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      _id: order._id,
      orderDetails: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.itemId', 'name image category');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    const order = await Order.findOne({ 
      _id: orderId,
      user: userId // Ensure users can only access their own orders
    }).populate('items.itemId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status value
    if (!['pending', 'confirmed', 'processing', 'in-transit', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Find the order and ensure it belongs to the user
    const order = await Order.findOne({ _id: id, user: userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order can be cancelled (e.g., not already delivered)
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        error: `Order cannot be cancelled as it is already ${order.status}` 
      });
    }
    
    // Update order status
    order.status = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();
    
    // Return inventory (optional)
    try {
      for (const item of order.items) {
        await Inventory.findByIdAndUpdate(
          item.itemId,
          { $inc: { quantity: item.quantity } }
        );
      }
    } catch (err) {
      console.error('Error returning inventory:', err);
      // Handle inventory return failures
    }
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

module.exports = exports;