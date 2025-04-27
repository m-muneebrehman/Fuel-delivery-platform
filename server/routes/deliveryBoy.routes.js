const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware')
const deliveryBoyController = require('../controllers/deliveryBoy.controller');




router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Min length should be 6'),
    body('fullName').isLength({ min: 3 }).withMessage('Min length should be 3'),
    body('phoneNumber')
        .matches(/^[0-9]{11}$/)
        .withMessage('Phone number must be 11 digits'),
    body('cnicNumber')
        .matches(/^\d{5}-\d{7}-\d$/)
        .withMessage('CNIC must be in format: 12345-1234567-1'),
    body('photo')
        .notEmpty()
        .withMessage('Photo is required'),
    body('address')
        .isLength({ min: 5 })
        .withMessage('Address must be at least 10 characters long'),
    body('fuelPump')
        .notEmpty()
        .withMessage('Fuel pump selection is required')
],  deliveryBoyController.registerDeliveryBoy);



router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Min length should be 6')
],deliveryBoyController.loginDeliveryBoy);

router.get('/profile',authMiddleware.authDeliveryBoy,deliveryBoyController.getDeliveryBoyProfile);

router.get('/logout',authMiddleware.authDeliveryBoy, deliveryBoyController.logoutDeliveryBoy);

module.exports = router;


