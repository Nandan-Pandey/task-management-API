import { ClientSession, Types } from "mongoose";
import { ISubtask, SubtaskModel } from "../../models/subtaskModel";
import { errorResponse, successResponse } from "../../utils/resp";
import { createSubtaskDao, getSubtaskById, updateSubtask } from "../../dao/subTask/subTaskDao";
import { TaskModel } from "../../models/taskModel";



const ALLOWED_STATUSES = ["To Do", "In Progress", "Done", "Blocked"];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

// ✅ Create Subtask
export const createSubtask = async (subtaskData: Partial<ISubtask>, session?: ClientSession) => {
  try {
    if (!subtaskData.parentTaskId) {
      return errorResponse("Subtask must reference a parentTaskId", 400);
    }
    if (!subtaskData.assignees || subtaskData.assignees.length === 0) {
      return errorResponse("At least one assignee is required for subtask", 400);
    }
    if (subtaskData.status && !ALLOWED_STATUSES.includes(subtaskData.status)) {
      return errorResponse(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`, 400);
    }

    subtaskData.statusHistory = [
      { from: "Created", to: subtaskData.status || "To Do", timestamp: new Date() },
    ];

    const subtask = new SubtaskModel(subtaskData);
    const savedSubtask = await subtask.save({ session });
    return successResponse(savedSubtask.toObject(), "Subtask created successfully", 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create subtask", 500);
  }
};

// ✅ Get Subtask by ID
export const getSubtaskByIdService = async (subtaskId: any) => {
  try {
    const subtask = await getSubtaskById(subtaskId);

    console.log(subtask);
    
    if (!subtask) {
      return errorResponse("Subtask not found", 404);
    }
    return successResponse({...subtaskId,subTask:subtask}, "Subtask fetched", 200);
  } catch (error) {
    return errorResponse("Failed to fetch subtask", 500, error);
  }
};

// ✅ Assign Users to Subtask
export const assignTaskOrSubtaskService = async (
  id: string,
  updateData: { assignees?: string[]; status?: string }
) => {
  try {
    // First check if it's a main task
    const task = await TaskModel.findById(id).exec();

    if (task) {
      // ✅ It's a main task → update directly
      return updateTask(id, updateData);
    } 
    else{
      return errorResponse("Failed to update task/subtask", 400,);
    }
  } catch (error) {
    return errorResponse("Failed to update task/subtask", 500, error);
  }
};




export const updateTask = async (
  id: string,
  updateData: { assignees?: string[]; status?: string }
) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid task ID", 400);
    }

    // ✅ populate virtual subtasks
    const task: any = await TaskModel.findById(id).populate("subtasks").exec();
    if (!task) {
      return errorResponse("Task not found", 404);
    }

    let message = "Task updated successfully";

    // 🔹 Handle assignees
    if (updateData.assignees?.length) {
      const existingAssignees = task.assignees.map((a: any) => a.toString());
      const newAssignees = updateData.assignees.map((a) => a.toString());

      // find duplicates
      const duplicates = newAssignees.filter((a) =>
        existingAssignees.includes(a)
      );
      if (duplicates.length > 0) {
        message = `Assignee(s) already present: ${duplicates.join(", ")}`;
      }

      // merge unique assignees
      const mergedAssignees = Array.from(
        new Set([...existingAssignees, ...newAssignees])
      );
      task.assignees = mergedAssignees;

      // ✅ cascade to subtasks
      for (const subtask of task.subtasks) {
        const subExisting = subtask.assignees.map((a: any) => a.toString());
        subtask.assignees = Array.from(
          new Set([...subExisting, ...mergedAssignees])
        );
        await subtask.save();
      }
    }

    // 🔹 Handle status
    if (updateData.status) {
      // push to history before changing
      if (task.status !== updateData.status) {
        task.statusHistory.push({
          from: task.status,
          to: updateData.status,
          timestamp: new Date(),
        });
      }

      task.status = updateData.status;

      // ✅ cascade to subtasks
      for (const subtask of task.subtasks) {
        if (subtask.status !== updateData.status) {
          subtask.statusHistory.push({
            from: subtask.status,
            to: updateData.status,
            timestamp: new Date(),
          });
        }
        subtask.status = updateData.status;
        await subtask.save();
      }
    }

    const updatedTask = await task.save();
    return successResponse(updatedTask.toObject(), message, 200);
  } catch (error) {
    console.error("Error in updateTask:", error);
    return errorResponse("Failed to update task", 500, error);
  }
};


