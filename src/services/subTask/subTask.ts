import { Types } from "mongoose";
import { ISubtask } from "../../models/subtaskModel";
import { errorResponse, successResponse } from "../../utils/resp";
import { createSubtaskDao, getSubtaskById, updateSubtask } from "../../dao/subTask/subTaskDao";



const ALLOWED_STATUSES = ["To Do", "In Progress", "Done", "Blocked"];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

// ✅ Create Subtask
export const createSubtask = async (subtaskData: Partial<ISubtask>) => {
  try {
    if (!subtaskData.parentTaskId) {
      return errorResponse("Subtask must reference a parentTaskId", 400);
    }

    if (!subtaskData.assignees || subtaskData.assignees.length === 0) {
      return errorResponse("At least one assignee is required for subtask", 400);
    }

    if (subtaskData.status && !ALLOWED_STATUSES.includes(subtaskData.status)) {
      return errorResponse(
        `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        400
      );
    }

    if (
      subtaskData.storyPoints !== undefined &&
      !FIBONACCI_STORY_POINTS.includes(subtaskData.storyPoints)
    ) {
      return errorResponse(
        `Story points must be one of: ${FIBONACCI_STORY_POINTS.join(", ")}`,
        400
      );
    }

    // Initialize statusHistory
    subtaskData.statusHistory = [
      {
        from: "Created",
        to: subtaskData.status || "To Do",
        timestamp: new Date()
      }
    ];

    // Simulate assignment notification
    if (subtaskData.assignees.length > 0) {
      const assigneeIds = subtaskData.assignees.map((a) => a.toString());
      console.log(
        `Subtask '${subtaskData.title}' assigned to [${assigneeIds.join(", ")}] on ${new Date().toISOString()}`
      );
    }

    const subtask = await createSubtaskDao(subtaskData);
    return successResponse(subtask, "Subtask created", 201);
  } catch (error) {
    return errorResponse("Failed to create subtask", 500, error);
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
export const assignSubtaskUsersService = async (
  subtaskId: string,
  assignees: string[]
) => {
  try {
    if (!assignees || assignees.length === 0) {
      return errorResponse("At least one assignee is required", 400);
    }

    const assigneeObjectIds = assignees.map((id) => new Types.ObjectId(id));
    const subtask = await updateSubtask(subtaskId, {
      assignees: assigneeObjectIds
    });

    if (!subtask) {
      return errorResponse("Subtask not found", 404);
    }

    return successResponse(subtask, "Assignees updated");
  } catch (error) {
    return errorResponse("Failed to update assignees", 500, error);
  }
};
