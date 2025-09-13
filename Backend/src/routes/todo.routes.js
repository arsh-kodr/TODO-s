const express = require("express");
const {authMiddleware} = require("../middlewares/auth.middleware");
const {createTodo , getTodos , updateTodo , deleteTodo} = require("../controllers/todo.controller");

const router = express.Router();

router.post("/create" , authMiddleware,  createTodo);
router.get("/" , authMiddleware , getTodos);
router.put("/update/:id" , authMiddleware , updateTodo);
router.delete("/delete/:id" , authMiddleware , deleteTodo);


module.exports = router;