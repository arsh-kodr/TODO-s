const express = require("express");
const {
  registerUser,
  loggedInUser,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loggedInUser);

module.exports = router;
