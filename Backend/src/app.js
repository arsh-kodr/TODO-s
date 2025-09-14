const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes")
const aiRoutes = require("./routes/ai.routes")
const cors = require("cors");
const path = require("path")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join("public")))

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,                
  })
);

app.use("/api/auth", authRoutes);
app.use("/todo" , todoRoutes);
app.use("/ai" ,aiRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

module.exports = app;