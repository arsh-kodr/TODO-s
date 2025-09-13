const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { generateSubTasks, parseTodo } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/subtasks", protect, generateSubTasks);
router.post("/parse", protect, parseTodo);

module.exports = router;
