import express, { Request, Response, Router } from 'express';
import Task, { ITask } from './task';

const router: Router = express.Router();

// @desc Get all tasks
// @route GET /api/tasks
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// @desc Create a new task
// @route POST /api/tasks
router.post('/tasks', async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
     res.status(400).json({ message: 'Title is required' });
     return;
  }

  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

// @desc Update a task
// @route PUT /api/tasks/:id
router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// @desc Delete a task
// @route DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask) {
            res.status(404).json({ message: 'Task not found'});
            return;
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

export default router;