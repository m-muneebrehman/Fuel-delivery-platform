const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");

module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log('I cannot reach here');
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, email, password } = req.body;

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      userName,
      email,
      password: hashedPassword,
    });

    const userId = user._id;

    const token = user.generateAuthToken();

    res.status(201).json({ token, userId });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const userId = user._id;

  const token = user.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, userId });
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.query.userId; // Fixed: extract userId from req.query.userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send only specific fields
    res.status(200).json({
      userId: user._id,
      userName: user.userName,      // Adjust according to your model
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { userId, userName, phoneNumber } = req.body

    if (!userId || !userName || !phoneNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        userName: userName,
        phoneNumber: phoneNumber,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: updatedUser._id,
      userName: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phone,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports.logoutUser = async (req, res, next) => {
  
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });
  
res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};
