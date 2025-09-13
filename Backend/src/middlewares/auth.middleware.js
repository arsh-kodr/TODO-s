const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const jwt_secret = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  if (!req.cookies) {
    return res.status(400).json({
      message: "Cookies not found",
    });
  }
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      message: "Token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret); // {_id : user._id}

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
}

module.exports = authMiddleware;
