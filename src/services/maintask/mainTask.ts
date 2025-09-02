

import mongoose, { ClientSession, Types } from "mongoose";
import { ITask, TaskModel } from "../../models/taskModel";
import { errorResponse, successResponse } from "../../utils/resp";
import { countSubtasksByParentIdDao,  createSubtaskDao,  createTaskDao, deleteTaskDao, getAllTasks, getAllTasksDao,  getSubtasksByParentIdDao,  getSubtasksByParentIdWithProjectionDao,  getTaskByIdDao,  updateSubtaskDao, updateTaskDao } from '../../dao/maintask/maintaskDao';
import { deleteSubtasksByParentIdDao } from "../../dao/subTask/subTaskDao";
import { ISubtask, SubtaskModel } from "../../models/subtaskModel";


const ALLOWED_STATUSES = ["To Do", "In Progress", "Done", "Blocked"];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];






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
export const deleteTaskRestrict = async (taskId: string) => {
  try {
    const subtaskCount = await countSubtasksByParentIdDao(taskId);
    if (subtaskCount > 0) {
      return errorResponse("Cannot delete task with existing subtasks", 400);
    }

    const deletedTask = await deleteTaskDao(taskId);
    if (!deletedTask) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(null, "Task deleted successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete task", 500, error);
  }
};

export const createTaskService = async (
  taskData: Partial<ITask>,
  subtasks?: Partial<ISubtask>[]
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1) Validate Task
      if (!taskData.assignees || taskData.assignees.length === 0) {
        throw new Error("At least one assignee is required");
      }
      if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
        throw new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`);
      }
      if (
        taskData.storyPoints !== undefined &&
        !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)
      ) {
        throw new Error(
          `Story points must be one of: ${FIBONACCI_STORY_POINTS.join(", ")}`
        );
      }

      taskData.statusHistory = [
        { from: "Created", to: taskData.status || "To Do", timestamp: new Date() },
      ];

      // 2) Create Task
      const createdTask = await createTaskDao(taskData, session);

      // 3) Create Subtasks
      const createdSubtasks: any = [];
      if (subtasks?.length) {
        for (const s of subtasks) {
          s.parentTaskId = new Types.ObjectId(createdTask._id);
          if (!s.assignees || s.assignees.length === 0) {
            throw new Error("Each subtask must have at least one assignee");
          }
          if (s.status && !ALLOWED_STATUSES.includes(s.status)) {
            throw new Error(`Invalid status for subtask. Allowed: ${ALLOWED_STATUSES.join(", ")}`);
          }
          s.statusHistory = [
            { from: "Created", to: s.status || "To Do", timestamp: new Date() },
          ];

          const subtask = await createSubtaskDao(s, session);
          createdSubtasks.push(subtask);
        }
      }

      (session as any).__result__ = { createdTask, createdSubtasks };
    });

    const { createdTask, createdSubtasks } = (session as any).__result__ ?? {};
    return successResponse(
      { task: createdTask, subtasks: createdSubtasks ?? [] },
      "Task and subtasks created successfully",
      201
    );
  } catch (error: any) {
    return errorResponse(error.message || "Task creation failed", 500, error);
  } finally {
    session.endSession();
  }
};

export const getAllTasksWithSubtaskTitlesService = async () => {
  try {
    const tasks = await getAllTasksDao();

    const results = await Promise.all(
      tasks.map(async (task: ITask) => {
        const subtasks = await getSubtasksByParentIdWithProjectionDao(
          task._id.toString(),
          { title: 1, storyPoints: 1 }
        );

        // Calculate total story points (task + subtasks)
        const taskStoryPoints = task.storyPoints ?? 0;
        const subtaskStoryPoints = subtasks.reduce(
          (sum: number, st: any) => sum + (st.storyPoints ?? 0),
          0
        );
        const totalStoryPoints = taskStoryPoints + subtaskStoryPoints;

        return {
          task,
          subtasks: subtasks.map((st: any) => ({
            title: st.title,
            storyPoints: st.storyPoints,
          })),
          totalStoryPoints,
        };
      })
    );

    return successResponse(results, "Fetched tasks successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch tasks", 500, error);
  }
};

export const updateTaskWithSubtasksService = async (
  taskId: string,
  taskData: Partial<ITask>,
  subtasks?: Partial<ISubtask>[]
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    let updatedTask: ITask | null = null;
    let updatedSubtasks: ISubtask[] = [];

    await session.withTransaction(async () => {
      // ✅ Validate Task fields
      if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
        throw new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`);
      }
      if (
        taskData.storyPoints !== undefined &&
        !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)
      ) {
        throw new Error(
          `Story points must be one of: ${FIBONACCI_STORY_POINTS.join(", ")}`
        );
      }
      if (taskData.assignees && taskData.assignees.length === 0) {
        throw new Error("At least one assignee is required for task");
      }

      // ✅ Update Task
      updatedTask = await updateTaskDao(taskId, taskData, session);
      if (!updatedTask) throw new Error("Task not found");

      // ✅ Update Subtasks
      if (subtasks?.length) {
        for (const sub of subtasks) {
          if (!sub._id) continue; // skip if no id provided
          if (sub.status && !ALLOWED_STATUSES.includes(sub.status)) {
            throw new Error(
              `Invalid status for subtask. Allowed: ${ALLOWED_STATUSES.join(", ")}`
            );
          }
          if (sub.assignees && sub.assignees.length === 0) {
            throw new Error("At least one assignee is required for subtask");
          }

          const updatedSub = await updateSubtaskDao(sub._id.toString(), sub, session);
          if (updatedSub) updatedSubtasks.push(updatedSub);
        }
      }

      (session as any).__result__ = { updatedTask, updatedSubtasks };
    });

    const { updatedTask: finalTask, updatedSubtasks: finalSubtasks } =
      (session as any).__result__ ?? {};

    // ✅ Recalculate total story points
    const subtasksWithProjection = await getSubtasksByParentIdWithProjectionDao(
      finalTask._id.toString(),
      { title: 1, storyPoints: 1 }
    );
    const taskStoryPoints = finalTask.storyPoints ?? 0;
    const subtaskStoryPoints = subtasksWithProjection.reduce(
      (sum, st) => sum + (st.storyPoints ?? 0),
      0
    );
    const totalStoryPoints = taskStoryPoints + subtaskStoryPoints;

    return successResponse(
      {
        task: finalTask,
        subtasks: subtasksWithProjection,
        totalStoryPoints,
      },
      "Task and subtasks updated successfully",
      200
    );
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update task", 500, error);
  } finally {
    session.endSession();
  }
};




export const getTaskWithSubtasksService = async (taskId: string) => {
  try {
    const task = await getTaskByIdDao(taskId);
    if (!task) {
      return errorResponse("Task not found", 404);
    }

    const subtasks = await getSubtasksByParentIdDao(task._id.toString());

    return successResponse(
      { ...task, subtasks },
      "Fetched task with subtasks successfully",
      200
    );
  } catch (error: any) {
    return errorResponse("Failed to fetch task with subtasks", 500, error);
  }
};
export const deleteTaskService = async (taskId: string, strategy: string) => {
  try {
    if (strategy === "restrict") {
      const subtaskCount = await countSubtasksByParentIdDao(taskId);
      if (subtaskCount > 0) {
        return errorResponse("Cannot delete task with existing subtasks", 400);
      }
    }

    const deletedTask = await deleteTaskDao(taskId);
    if (!deletedTask) {
      return errorResponse("Task not found", 404);
    }

    return successResponse(null, "Task deleted successfully", 200);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete task", 500, error);
  }
};

