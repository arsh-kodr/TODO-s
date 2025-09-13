const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",  // your frontend URL
    credentials: true,                // allow cookies/headers
  })
);

app.use("/api/auth", authRoutes);
app.use("/todo" , todoRoutes);

module.exports = app;