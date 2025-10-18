const express = require("express")

const {createTodo,readTodos,updateTodo,deleteTodo} = require('../controller/todoController')

const router  =  express.Router()

router.post("/createTodo", createTodo)
router.get("/readTodos", readTodos)
router.post("/updateTodo", updateTodo)
router.post("/deleteTodo", deleteTodo)

module.exports = router