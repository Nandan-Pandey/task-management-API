import { Types } from "mongoose";
import { ISubtask } from "../models/subtaskModel";
import { ITask } from "../models/taskModel";
import { createTask, getAllTasksWithSubtaskTitlesService } from "../services/maintask/mainTask";
import { assignSubtaskUsersService, createSubtask, getSubtaskByIdService } from "../services/subTask/subTask";
import { getTaskByIdDao } from "../dao/maintask/maintaskDao";

         



const ALLOWED_STATUSES = ['To Do', 'In Progress', 'Done', 'Blocked'];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

export const createTaskS = async (
  taskData: Partial<ITask>,
  subtasks?: Partial<ISubtask>[]
): Promise<{
  task: ISubtask;
  subtasks: ISubtask[];
}> => {
  // Task validation
  if (!taskData.title || !taskData.description) {
    throw new Error('Title and description are required');
  }

  if (!taskData.assignees || taskData.assignees.length === 0) {
    throw new Error('At least one assignee is required');
  }

  if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
    throw new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (taskData.storyPoints !== undefined && !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)) {
    throw new Error(`Story points must be one of: ${FIBONACCI_STORY_POINTS.join(', ')}`);
  }


  
  // Initialize status history
  taskData.statusHistory = [{
    from: 'Created',
    to: taskData?.status || 'To Do',
    timestamp: new Date()
  }];


//   // Simulate notification
//   const assigneeIds = taskData.assignees.map(a => a.toString());
//   console.log(`Task '${taskData.title}' assigned to [${assigneeIds.join(', ')}] on ${new Date().toISOString()}`);

  // Create Task
  const createdTask:any = await createTask(taskData);

  let createdSubtasks: any[] = [];

  // Create Subtasks
  if (subtasks && subtasks.length > 0) {
    for (const subtaskData of subtasks) {
      // Subtask must reference parentTaskId
      subtaskData.parentTaskId = createdTask._id as Types.ObjectId;// Set parent task ID
      // Subtask Validation
      if (!subtaskData.title || !subtaskData.description) {
        throw new Error('Each subtask requires a title and description');
      }
      if (!subtaskData.assignees || subtaskData.assignees.length === 0) {
        throw new Error('Each subtask must have at least one assignee');
      }
      if (subtaskData.status && !ALLOWED_STATUSES.includes(subtaskData.status)) {
        throw new Error(`Subtask status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
      }
      if (subtaskData.storyPoints !== undefined && !FIBONACCI_STORY_POINTS.includes(subtaskData.storyPoints)) {
        throw new Error(`Subtask story points must be one of: ${FIBONACCI_STORY_POINTS.join(', ')}`);
      }
      subtaskData.statusHistory = [{
        from: 'Created',
        to: subtaskData.status || 'To Do',
        timestamp: new Date()
      }];
      subtaskData.createdAt = new Date();
      subtaskData.updatedAt = new Date();

      // Simulate notification
      const subAssignees = subtaskData.assignees.map(a => a.toString());
      console.log(`Subtask '${subtaskData.title}' assigned to [${subAssignees.join(', ')}] on ${new Date().toISOString()}`);

      // Save subtask
      const createdSubtask = await createSubtask(subtaskData);
      createdSubtasks.push(createdSubtask);
    }
  }

  return { task: createdTask, subtasks: createdSubtasks };
};


export const getAllTasksWithSubtaskTitles = async () => {
  try {
    return await getAllTasksWithSubtaskTitlesService();
  } catch (error) {
    throw error;
  }
};

export const getTaskWithSubtasks = async (taskId: any) => {
  try {

    const task = await getTaskByIdDao(taskId);
    if (!task) return null;
    const subtasks = await getSubtaskByIdService(task);
    return subtasks;
  } catch (error) {
    throw error;
  }
};


export const assignSubtaskUsers = async (taskId: string, assignees: string[]) => {
  try {
    // Validation can be added here if needed
    const updatedTask = await assignSubtaskUsersService(taskId, assignees);
    return updatedTask;
  } catch (error) {
    throw error;
  }
};