const userModel = require("../models/user.model");
const fuelPumpModel = require("../models/fuelPump.model");
const deliveryBoyModel = require('../models/deliveryBoy.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

const extractToken = (req) => {
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers.authorization?.split(" ")[1];
    const tokenFromQuery = req.query?.token;
    
    const token = tokenFromCookie || tokenFromHeader || tokenFromQuery;
    
    if (token) {
        console.log("Token found:", token.substring(0, 15) + "...");
    } else {
        console.log("No token found in request");
    }
    
    return token;
};

const isTokenBlacklisted = async (token) => {
    const blacklisted = await blacklistTokenModel.findOne({ token });
    if (blacklisted) {
        console.log("Token is blacklisted");
    }
    return !!blacklisted;
};

const createAuthMiddleware = (model, userType) => {
    return async (req, res, next) => {
        try {
            const token = extractToken(req);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No authentication token provided"
                });
            }

            if (await isTokenBlacklisted(token)) {
                return res.status(401).json({
                    success: false,
                    message: "Token has been revoked"
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("Token decoded successfully:", decoded);
                
                const user = await model.findById(decoded._id);
                
                if (!user) {
                    console.log("User not found with ID:", decoded._id);
                    return res.status(401).json({
                        success: false,
                        message: "User not found"
                    });
                }
                
                console.log(`${userType} authenticated:`, user._id);
                req[userType] = user;
                req.user = user;
                next();
            } catch (jwtError) {
                console.error("JWT verification error:", jwtError.name, jwtError.message);
                
                if (jwtError.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: "Token has expired"
                    });
                }
                
                return res.status(401).json({
                    success: false,
                    message: "Invalid authentication token"
                });
            }
        } catch (error) {
            console.error("Authentication middleware error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error during authentication"
            });
        }
    };
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions"
            });
        }

        next();
    };
};

// Export middleware functions
module.exports = {
    // Base authentication middleware
    authUser: createAuthMiddleware(userModel, 'user'),
    authFuelPump: createAuthMiddleware(fuelPumpModel, 'fuelPump'),
    authDeliveryBoy: createAuthMiddleware(deliveryBoyModel, 'deliveryBoy'),

    // Role-based middleware
    adminMiddleware: checkRole(['admin']),
    fuelPumpMiddleware: checkRole(['fuel_pump']),
    deliveryBoyMiddleware: checkRole(['delivery_boy']),
    userMiddleware: checkRole(['user']),

    // Combined middleware
    authMiddleware: (req, res, next) => {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }
        next();
    },

    // Optional authentication middleware
    optionalAuth: async (req, res, next) => {
        const token = extractToken(req);
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await userModel.findById(decoded._id);
                if (user && user.status === 'active') {
                    req.user = user;
                }
            } catch (error) {
                // Token is invalid, but we don't block the request
                console.log('Invalid token in optional auth:', error.message);
            }
        }
        next();
    }
};


