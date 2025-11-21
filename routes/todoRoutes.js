const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const { requireAuth } = require('../middleware/authMiddleware');

// Get todos page
router.get("/", requireAuth, todoController.getTodos);

// Create todos from checklist
router.post("/generate-from-checklist", requireAuth, todoController.createTodosFromChecklist);

// Create a new todo
router.post("/", requireAuth, todoController.createTodo);

// Update todo status
router.patch("/:id", requireAuth, todoController.updateTodoStatus);

// Delete todo
router.delete("/:id", requireAuth, todoController.deleteTodo);

module.exports = router;

