const express = require("express");
const {
  registerUser,
  loggedInUser,
} = require("../controllers/auth.controller");
const {protect} = require("../middlewares/auth.middleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loggedInUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
});


module.exports = router;
