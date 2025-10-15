require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { TodoModel } = require("./models/Todos");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const mongo_URL = process.env.DB_URL;

mongoose
  .connect(mongo_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.post("/createTodo", async (req, res) => {
  try {
    const todo = req.body;
    const newTodo = new TodoModel(todo);
    await newTodo.save();
    res
      .status(201)
      .json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/readTodos", async (req, res) => {
  const todos = await TodoModel.find();
  res.send(todos);
});

app.post("/updateTodo", async (req, res) => {
  const todo = req.body;
  await TodoModel.findByIdAndUpdate(
    todo._id,
    { status: "Completed" },
    { merge: true }
  );
  res.send("Todo updated");
});

app.post("/deleteTodo", async (req, res) => {
  const todo = req.body;
  await TodoModel.findByIdAndDelete(todo._id);
  res.send("Todo Deleted");
});


app.listen(PORT, () => {
  console.log(" Server running on port", PORT);
});
