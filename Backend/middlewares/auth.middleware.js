const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Blacklisted Unauthorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decoded.id }).populate("rides");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = {
      _id: user._id,
      fullname: {
        firstname: user.fullname.firstname,
        lastname: user.fullname.lastname,
      },
      email: user.email,
      phone: user.phone,
      rides: user.rides,
      socketId: user.socketId,
      emailVerified: user.emailVerified || false,
    };
    req.userType = "user";

    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      return res.status(401).json({ message: "Unauthorized User", error });
    }
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel
      .findOne({ _id: decoded.id })
      .populate("rides");
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    req.captain = {
      _id: captain._id,
      fullname: {
        firstname: captain.fullname.firstname,
        lastname: captain.fullname.lastname,
      },
      email: captain.email,
      phone: captain.phone,
      rides: captain.rides,
      socketId: captain.socketId,
      emailVerified: captain.emailVerified,
      vehicle: captain.vehicle,
      status: captain.status,
    };
    req.userType = "captain";
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      return res.status(401).json({ message: "Unauthorized User", error });
    }
  }
};
