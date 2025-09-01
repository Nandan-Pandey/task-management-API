import { Router } from 'express';
import { assignSubtaskUsers, createTaskS, getAllTasksWithSubtaskTitles, getTaskWithSubtasks } from '../controllers/taskController';



const router = Router();

router.post('/createTask', async (req, res, next) => {
  try {
    const {  subtasks,...taskData } = req.body;
    if (!taskData || !taskData.title || !taskData.description) {
      return res.status(400).json({ error: 'Task title and description are required' });
    }
    const result = await createTaskS(taskData, subtasks);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/Alltasks', async (req, res, next) => {
  try {
    const tasksWithSubtaskTitles = await getAllTasksWithSubtaskTitles();
    res.json(tasksWithSubtaskTitles);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const taskWithSubtasks = await getTaskWithSubtasks(taskId);
    if (!taskWithSubtasks) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(taskWithSubtasks);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id/assign - Assign task to users (update assignees)
router.put('/:id/assign', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { assignees } = req.body;
    if (!Array.isArray(assignees) || assignees.length === 0) {
      return res.status(400).json({ error: 'Assignees must be a non-empty array' });
    }
    const updatedTask = await assignSubtaskUsers(taskId, assignees);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});





export default router;
