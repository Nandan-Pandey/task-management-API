import { Router } from 'express';
import {  assignTask, createTaskController,  deleteTask,  getAllTasksWithSubtaskTitlesController,  getTaskWithSubtasksController, updateTaskWithSubtasksController } from '../controllers/taskController';
import { autoSubtaskGen, processStory } from '../controllers/AI';



const router = Router();


router.post("/createTask", createTaskController);

router.get("/allTasks", getAllTasksWithSubtaskTitlesController);

router.get("/:id", getTaskWithSubtasksController);

router.delete("/:id", deleteTask);

router.put("/updateTask/:id", assignTask);

router.post("/AI/subtask", async (req, res, next) => {
  try {
    const   description = req.body; // expecting { taskId: "123", description: "..." }
    if ( !description) {
      return res.status(400).json({ error: "taskId and description are required" });
    }

    const result = await autoSubtaskGen( description);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/AI/story", async (req, res, next) => {
  try {
    const story  = req.body; // expecting { story: "string" }
    if (!story || typeof story['user-story'] !== "string") {
      return res.status(400).json({ error: "Story must be a valid string" });
    }

    const result = await processStory(story);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});



export default router;
