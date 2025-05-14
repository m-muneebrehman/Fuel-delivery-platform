const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware')
const fuelPumpController = require('../controllers/fuelPump.controller')


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('Min length should be 3'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 char long'),
    body('location').isLength({ min: 3 }).withMessage('Location must be at least 3 characters long')
],
    fuelPumpController.registerFuelPump);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 char long')
],
    fuelPumpController.loginFuelPump);

router.get('/myDeliveryBoys',authMiddleware.authFuelPump,fuelPumpController.getMyDeliveryBoys);


router.get('/profile', authMiddleware.authFuelPump, fuelPumpController.getFuelPumpProfile);

router.get('/logout', authMiddleware.authFuelPump, fuelPumpController.logoutFuelPump);

// New routes for handling fuel pump requests
router.get('/requests', fuelPumpController.getFuelPumpRequests);
router.post('/:id/approve', fuelPumpController.approveFuelPump);
router.post('/:id/reject', fuelPumpController.rejectFuelPump);



module.exports = router;
