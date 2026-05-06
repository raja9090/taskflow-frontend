const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


// ADD TASK
router.post('/add', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// GET TASKS
router.get("/", async (req, res) => {
  try {

    const tasks = await Task.find();

    res.status(200).json({
      success: true,
      tasks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});
// GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE TASK
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;