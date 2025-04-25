const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fuelPumpConteroller = require('../controllers/fuelPump.controller');


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.name').isLength({ min: 3 }).withMessage('Min length should be 3'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 char long'),
    body('location').isLength({ min: 3 }).withMessage('Location must be at least 3 characters long')
],
);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 char long')
],
);

