const { TodoModel } = require('../models/Todos');
const jwt = require("jsonwebtoken")

const createTodo = async (req, res) => {

  try{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token)return res.status(401).json({message:"No token provided"})

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      const userId  =decoded._id;

      const newTodo = new TodoModel({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        status: req.body.status,
        userId: userId,
      })

      await newTodo.save();
      res.status(201).json({ message: "Todo created successfully", todo: newTodo });
      


  }catch(error){
    console.error("Error saving todo:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }

};

const readTodos =  async (req, res) => {

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"no token provided"})

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) 
    const userId = decoded._id
    
    const todos = await TodoModel.find({userId})
    res.status(200).json(todos)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({message:"Server error"})
  }
};

// const updateTodo =("/updateTodo", async (req, res) => {
//   const todo = req.body;
//   await TodoModel.findByIdAndUpdate(
//     todo._id,
//     { status: "Completed" },
//     { merge: true }
//   );
//   res.send("Todo updated");
// });

const updateTodo =("/updateTodo", async (req, res) => {
  try {
    const { _id, title, location, description } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Todo ID is required" });
    }

    if (!title || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      _id,
      {
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
      },
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Error updating todo", error });
  }
});

const deleteTodo = ("/deleteTodo", async (req, res) => {
  const todo = req.body;
  await TodoModel.findByIdAndDelete(todo._id);
  res.send("Todo Deleted");
});

module.exports =  {createTodo, readTodos, updateTodo, deleteTodo};