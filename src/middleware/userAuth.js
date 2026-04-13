const ApiErr = require("../utils/ApiErr");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ApiErr(400, "User is not authenticated");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
};

const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ApiErr(
        400,
        `${req.user.role} not allowed to access this resource.`,
      );
    next();
  };
};

module.exports = { isAuthenticated, isAuthorized };
