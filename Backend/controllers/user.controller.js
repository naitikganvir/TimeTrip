const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");

module.exports.registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { fullname, email, password, phone } = req.body;

  const alreadyExists = await userModel.findOne({ email });

  if (alreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await userService.createUser(
    fullname.firstname,
    fullname.lastname,
    email,
    password,
    phone
  );

  const token = user.generateAuthToken();
  res
    .status(201)
    .json({ message: "User registered successfully", token, user });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Invalid verification link", error: "Token is required" });
  }

  let decodedTokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedTokenData || decodedTokenData.purpose !== "email-verification") {
    return res.status(400).json({ message: "You're trying to use an invalid or expired verification link", error: "Invalid token" });
  }

  let user = await userModel.findOne({ _id: decodedTokenData.id });

  if (!user) {
    return res.status(404).json({ message: "User not found. Please ask for another verification link." });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  user.emailVerified = true;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
  });
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);

  res.json({
    message: "Logged in successfully",
    token,
    user: {
      _id: user._id,
      fullname: {
        firstname: user.fullname.firstname,
        lastname: user.fullname.lastname,
      },
      email: user.email,
      phone: user.phone,
      rides: user.rides,
      socketId: user.socketId,
      emailVerified: user.emailVerified,
    },
  });
});

module.exports.userProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { fullname,  phone } = req.body;

  const updatedUserData = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      fullname: fullname,
      phone,
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Profile updated successfully", user: updatedUserData });
});

module.exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.token;

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token, password } = req.body;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        message:
          "This password reset link has expired or is no longer valid. Please request a new one to continue",
      });
    } else {
      return res.status(400).json({
        message:
          "The password reset link is invalid or has already been used. Please request a new one to proceed",
        error: err,
      });
    }
  }

  const user = await userModel.findById(payload.id);
  if (!user)
    return res.status(404).json({
      message: "User not found. Please check your credentials and try again",
    });

  user.password = await userModel.hashPassword(password);
  await user.save();

  res.status(200).json({
    message:
      "Your password has been successfully reset. You can now log in with your new credentials",
  });
});
