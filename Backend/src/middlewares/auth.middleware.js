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

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, jwt_secret);

    const user = await userModel.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to req
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized" });
  }
};
module.exports = { authMiddleware , protect};
