const Todo = require('../models/todoModel');
const Checklist = require('../models/checklistModel');

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.render('To-dolist', { 
      user: res.locals.user,
      todos: todos,
      activeNav: 'todo',
      title : 'To-do List'
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching todos: " + err.message 
    });
  }
};

// *** CREATE TODOLIST FROM CHECKLIST ***//
exports.createTodosFromChecklist = async (req, res) => {
  try {
    // Get filter parameters
    const { startDate, endDate, machineName, days } = req.body;
    
    // Build query
    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.dateChecked = { $gte: start, $lte: end }; // lọc theo ngày kiểm tra
    } else if (days) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);
      query.dateChecked = { $gte: targetDate };
    } else {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - 7);
      query.dateChecked = { $gte: targetDate };
    }


    //Debug Log
    console.log("Query used:", query);

    const s = await Checklist.find(query).sort({ createdAt: -1 });

    console.log("Checklist count:", s.length);

    // Filter by machine if specified
    if (machineName && machineName !== 'all') {
      query.machineName = machineName;
    }
    
    // Find checklists
    const checklists = await Checklist.find(query).sort({ createdAt: -1 });

    const todosCreated = [];
    
    // For each checklist, create a todo for items with comments
    for (const checklist of checklists) {
      // Only process items that have comments (issues found)
      if (!checklist.checklist || checklist.checklist.length === 0) continue;
      
      for (const item of checklist.checklist) {
        // Only create todos for items that have issues (comments are meant to document issues)
        if (item.comment && item.comment.trim() !== '') {
          // Check if todo already exists for this exact issue
          const existingTodo = await Todo.findOne({
            machineName: checklist.machineName,
            position: item.position,
            checkpoint: item.checkpoint,
            comment: item.comment,
            status: { $in: ['pending', 'in_progress'] }
          });
          
          if (!existingTodo) {
            const todo = new Todo({
              machineName: checklist.machineName,
              dateChecked: checklist.dateChecked,
              checkedBy: checklist.checkedBy,
              position: item.position,
              checkpoint: item.checkpoint,
              comment: item.comment,
              status: 'pending'
            });
            
            await todo.save();
            todosCreated.push(todo);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Created ${todosCreated.length} todos from checklists`,
      count: todosCreated.length,
      checklistsProcessed: checklists.length
    });
  } catch (err) {
    console.error("Error creating todos from checklist:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error creating todos: " + err.message 
    });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { machineName, position, checkpoint, comment } = req.body;
    
    if (!machineName || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Machine name and comment are required" 
      });
    }
    
    const todo = new Todo({
      machineName,
      position: position || '',
      checkpoint: checkpoint || '',
      comment
    });

    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo created successfully",
      todo: todo
    });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error creating todo: " + err.message 
    });
  }
};

// Update todo status
exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolvedBy, resolvedNote } = req.body;
    
    const updateData = { status };
    
    if (status === 'completed') {
      updateData.completedDate = new Date();
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedNote = resolvedNote;
    }

    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });

    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        message: "Todo not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: todo
    });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error updating todo: " + err.message 
    });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        message: "Todo not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting todo: " + err.message 
    });
  }
};

