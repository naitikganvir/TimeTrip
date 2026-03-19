const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../services/mail.service");
let { fillTemplate } = require("../templates/mail.template");

const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");

module.exports.sendVerificationEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  let user;

  if (req.userType === "user") {
    user = req.user;
  } else if (req.userType === "captain") {
    user = req.captain;
  } else {
    return res.status(400).json({ message: "The email verification link is invalid because of incorrect user type" });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "Your email is already verified. You may continue using the application." });
  }

  const token = jwt.sign(
    { id: user._id, userType: req.userType, purpose: "email-verification" },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  if (!token) {
    return res
      .status(500)
      .json({ message: "We're unable to generate a verification link at the moment. Please try again shortly." });
  }

  try {
    const verification_link = `${process.env.CLIENT_URL}/${req.userType}/verify-email?token=${token}`;

    let mailHtml = fillTemplate({
      title: "Email Verification Required",
      name: user.fullname.firstname,
      message: "Thank you for signing up with TimeTrip! To complete your registration and activate your account, please verify your email address by clicking the button below.",
      cta_link: verification_link,
      cta_text: "Verify Email",
      note: "For your security, this verification link is valid for only <strong>15 minutes</strong>.  If the link expires, you can request a new one from the login page. <br/>If you did not create a TimeTrip account, please disregard this email.",
    });

    const result = await sendMail(
      user.email,
      "TimeTrip - Email Verification",
      mailHtml
    );

    return res.status(200).json({
      message: "Verification email sent successfully",
      user: {
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
});

module.exports.forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { email } = req.body;
  const { userType } = req.params;

  let user = null;
  if (userType === "user") {
    user = await userModel.findOne({ email });
  } else if (userType === "captain") {
    user = await captainModel.findOne({ email });
  }
  if (!user) return res.status(404).json({ message: "User not found. Please check your credentials and try again" });

  const token = jwt.sign(
    { id: user._id, type: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.CLIENT_URL}/${userType}/reset-password?token=${token}`;

  let mailHtml = fillTemplate({
    title: "Reset Password",
    name: user.fullname.firstname,
    message: "We received a request to reset the password associated with your TimeTrip account. If you made this request, please click the button below to proceed.",
    cta_link: resetLink,
    cta_text: "Reset Password",
    note: "If you didn’t request a password reset, you can safely ignore this email. Your current password will remain unchanged. <br/>This verification link is valid for <strong>15 minutes</strong> only.",
  });

  await sendMail(user.email, "TimeTrip - Reset Password", mailHtml);

  res.status(200).json({ message: "Reset password email sent successfully" });
});

// Reset Password
module.exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors.array());

  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await userModel.findById(payload.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await userModel.hashPassword(password);
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});
