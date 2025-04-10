const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Routes imports (to be created later)
const authRoutes = require('./api/auth/routes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Fuel Delivery Platform API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;