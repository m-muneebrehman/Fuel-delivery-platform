const { validationResult } = require("express-validator");
const deliveryBoyService = require("../services/deliveryBoy.service");
const deliveryBoyModel = require("../models/deliveryBoy.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const blacklistTokenModel = require("../models/blacklistToken.model");

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Ensure the directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Export multer middleware to be used in your route
module.exports.upload = upload.single("photo");

// Register delivery boy controller
module.exports.registerDeliveryBoy = async (req, res, next) => {
  try {
    // Get validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      email,
      password,
      phoneNumber,
      cnicNumber,
      address,
      fuelPump,
    } = req.body;

    // Photo comes from multer
    const photoUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    console.log("All fields received:", {
      fullName,
      email,
      phoneNumber,
      cnicNumber,
      address,
      fuelPump,
      photoUrl,
    });

    // Check if delivery boy already exists
    const isDeliveryBoyExist = await deliveryBoyModel.findOne({ email });
    if (isDeliveryBoyExist) {
      return res.status(400).json({ message: "Delivery boy already exists" });
    }

    // Hash password
    const hashedPassword = await deliveryBoyModel.hashPassword(password);

    // Create new delivery boy
    const deliveryBoy = await deliveryBoyService.createDeliveryBoy({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      cnicNumber,
      photo: photoUrl, // Use the URL from multer upload
      address,
      fuelPump,
    });

    console.log("Successfully registered delivery boy");

    // Send success response
    res.status(201).json({ data: deliveryBoy });
  } catch (err) {
    console.error("Error in registerDeliveryBoy:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginDeliveryBoy = async (req, res, next) => {
  const { email, password } = req.body;

  const deliveryBoy = await deliveryBoyModel
    .findOne({ email })
    .select("+password");

  if (!deliveryBoy) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await deliveryBoy.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = deliveryBoy.generateAuthToken();

  res.cookie("token", token);

  const { password: _, ...safeDeliveryBoy } = deliveryBoy.toObject();

  res.status(200).json({ token, data: safeDeliveryBoy });
};


module.exports.getAllDeliveryBoys = async (req, res, next) => {
  const { pumpId } = req.query;
  try {
    const deliveryBoys = await deliveryBoyModel
      .find({ fuelPump: pumpId });

    res.status(200).json({ data: deliveryBoys });
  } catch (err) {
    console.error("Error in getAllDeliveryBoys:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteDeliveryBoy = async (req, res, next) => {
    const { boyId } = req.query;

    try {
        const deliveryBoy = await deliveryBoyModel.findByIdAndDelete(boyId);

        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery Boy does not exist" });
        }

        return res.status(200).json({ message: "Delivery Boy deleted successfully", data: deliveryBoy });
    } catch (error) {
        console.error("Error deleting delivery boy:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.statusChange = async (req, res, next) => {
    const { boyId, status } = req.query;

    try {
        const deliveryBoy = await deliveryBoyModel.findByIdAndUpdate(
            boyId,
            { status: status },
            { new: true } // Return the updated document
        );

        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery Boy not found" });
        }

        return res.status(200).json({ message: "Status updated successfully", data: deliveryBoy });
    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.logoutDeliveryBoy = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Get unverified delivery boys
module.exports.getUnverifiedDeliveryBoys = async (req, res) => {
  try {
    // Get all unverified delivery boys
    const unverifiedDeliveryBoys = await deliveryBoyModel.find({ isVerified: false })
      .populate('fuelPump', 'name location');

    return res.status(200).json({
      success: true,
      message: "Unverified delivery boys retrieved successfully",
      data: unverifiedDeliveryBoys
    });
  } catch (error) {
    console.error("Error getting unverified delivery boys:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Verify a delivery boy
module.exports.verifyDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await deliveryBoyModel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery boy verified successfully",
      data: deliveryBoy
    });
  } catch (error) {
    console.error("Error verifying delivery boy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Reject a delivery boy
module.exports.rejectDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    // For rejection, you might want to either delete the record or keep it with a rejected status
    const deliveryBoy = await deliveryBoyModel.findByIdAndUpdate(
      id,
      { isVerified: false, status: 'rejected' },
      { new: true }
    );

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery boy rejected successfully",
      data: deliveryBoy
    });
  } catch (error) {
    console.error("Error rejecting delivery boy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
