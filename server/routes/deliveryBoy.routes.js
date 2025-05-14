const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware')
const deliveryBoyController = require('../controllers/deliveryBoy.controller');




router.post(
  "/register",
  deliveryBoyController.upload, // Make sure upload middleware runs first
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("cnicNumber").notEmpty().withMessage("CNIC number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("fuelPump").notEmpty().withMessage("Fuel pump ID is required"),
  ],
  deliveryBoyController.registerDeliveryBoy
);

router.get('/getDeliveryBoys', deliveryBoyController.getAllDeliveryBoys);

router.delete('/delete', deliveryBoyController.deleteDeliveryBoy);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Min length should be 6')
],deliveryBoyController.loginDeliveryBoy);

router.put('/statusChange', deliveryBoyController.statusChange);

router.get('/logout',authMiddleware.authDeliveryBoy, deliveryBoyController.logoutDeliveryBoy);

// New routes for handling delivery boy requests - similar to fuel pump routes
router.get('/unverified', deliveryBoyController.getUnverifiedDeliveryBoys);
router.post('/:id/verify', deliveryBoyController.verifyDeliveryBoy);
router.post('/:id/reject', deliveryBoyController.rejectDeliveryBoy);

module.exports = router;


