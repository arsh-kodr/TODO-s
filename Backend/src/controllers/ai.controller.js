const { askGemini } = require("../service/ai.service");
const todoModel = require("../models/todo.model")

// Generate subtasks for a todo
async function generateSubTasks(req, res) {
  const { title , description} = req.body;
  console.log(req.body);
  
  const userID = req.user._id;

  const prompt = `Generate exactly 5 clear subtasks for the todo: "${title}"`;

  try {
    const response = await askGemini(prompt, {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
      },
    });

    const subtasks = JSON.parse(response);
    console.log(subtasks);

    const todo = await todoModel.create({
      title,
      description,
      subTasks : subtasks,
      user : userID
    })
    
    res.json({ subtasks });
  } catch (error) {
    console.error(" AI Subtask Error:", error.message);
    res.status(500).json({ message: "AI error", error: error.message });
  }
}

// Parse natural language into structured todo
async function parseTodo(req, res) { 
  const { input } = req.body;

  const prompt = `Extract structured todo from: "${input}"`;

  try {
    const response = await askGemini(prompt, {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string" }, 
        recurrence: { type: "string" },
      },
      required: ["title"],
    });

    const todo = JSON.parse(response);
    res.json({ todo });
  } catch (error) {
    console.error("AI Parse Error:", error.message);
    res.status(500).json({ message: "AI error", error: error.message });
  }
}

module.exports = { generateSubTasks, parseTodo };
