const todoModel = require("../models/todo.model");

async function createTodo(req, res) {
  const { title, description, status } = req.body;

  const userID = req.user._id;

  if (!title || !description) {
    res.status(400).json({
      message: "Enter title and description",
    });
  }

  const todo = await todoModel.create({
    title,
    description,
    status,
    user: userID,
  });

  res.status(201).json({
    message: "Todo Created Successfully",
    todo,
  });
}

async function getTodos(req, res) {
  const userId = req.user._id;
  const todo = await todoModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "todo fetched successfully",
    todo,
  });
}

async function updateTodo(req, res) {

    const {id} = req.params
    console.log("Params -> ",req.params);
    console.log(req.body);
    
    
    const {title , description} = req.body;

    const updatedTodo = await todoModel.findByIdAndUpdate(id,{title , description});

    res.status(200).json({
        message : "Todo Updated Successfully",
        updatedTodo
    })
    
}

async function deleteTodo(req, res) {

    const {id} = req.params;

   await todoModel.findOneAndDelete({ _id: id, user: req.user._id });

    res.status(200).json({
        message : "Todo Deleted Successfully"
    })
    
}

module.exports = { createTodo, getTodos , updateTodo , deleteTodo};
