
import { Types } from "mongoose";
import { ITask } from "../../models/taskModel";
import { errorResponse, successResponse } from "../../utils/resp";
import { createTaskDao, getAllTasks, getSubtasksByParentIdWithProjection, getTaskByIdDao, updateTaskDao } from '../../dao/maintask/maintaskDao';


const ALLOWED_STATUSES = ["To Do", "In Progress", "Done", "Blocked"];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

export const createTask = async (taskData: Partial<ITask>) => {
  try {
    if (!taskData.assignees || taskData.assignees.length === 0) {
      return errorResponse("At least one assignee is required", 400);
    }

    if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
      return errorResponse(
        `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        400
      );
    }

    if (
      taskData.storyPoints !== undefined &&
      !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)
    ) {
      return errorResponse(
        `Story points must be one of: ${FIBONACCI_STORY_POINTS.join(", ")}`,
        400
      );
    }

    taskData.statusHistory = [
      {
        from: "Created",
        to: taskData.status || "To Do",
        timestamp: new Date(),
      },
    ];

    const task = await createTaskDao(taskData);

    return successResponse(task, "Task created successfully", 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create task", 500, error);
  }
};

export const getAllTasksWithSubtaskTitlesService = async () => {
  try {
    const tasks = await getAllTasks();
    const results = await Promise.all(
      tasks.map(async (task: ITask) => {
        const subtasks = await getSubtasksByParentIdWithProjection(
          task._id.toString(),
          { title: 1 }
        );
        return { task, subtaskTitles: subtasks.map((st:any) => st.title) };
      })
    );

    return successResponse(results, "Fetched tasks successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch tasks", 500, error);
  }
};

export const getTaskById = async (taskId: string) => {
  try {
    const task = await getTaskByIdDao(taskId);
    if (!task) {
      return errorResponse("Task not found", 404);
    }
    return successResponse(task, "Fetched task successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch task", 500, error);
  }
};

export const assignTaskUsers = async (taskId: string, assignees: string[]) => {
  try {
    if (!assignees || assignees.length === 0) {
      return errorResponse("At least one assignee is required", 400);
    }

    const assigneeObjectIds = assignees.map((id) => new Types.ObjectId(id));
    const updatedTask = await updateTaskDao(taskId, {
      assignees: assigneeObjectIds,
    });

    return successResponse(updatedTask, "Task users assigned successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to assign users", 500, error);
  }
};
