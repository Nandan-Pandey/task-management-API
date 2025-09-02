import mongoose, { ClientSession, Types } from 'mongoose';
import { ISubtask, SubtaskModel } from '../../models/subtaskModel';
import { errorResponse, successResponse } from '../../utils/resp';

/**
 * Create a new Subtask
 */
export const createSubtaskDao = async (
  subtaskData: Partial<ISubtask>,
  session?: ClientSession
): Promise<ISubtask> => {
  try {
    const subtask = new SubtaskModel(subtaskData);
    const savedSubtask = await subtask.save({ session });
    return savedSubtask.toObject();
  } catch (error) {
    console.error("Error creating subtask:", error);
    throw error; // rethrow so the service layer can handle it
  }
};
/**
 * Get Subtask by ID
 */
export const getSubtaskById = async (id: any): Promise<ISubtask | null> => {
  try {
    console.log("Getting subtask by ID:", id);

    if (!Types.ObjectId.isValid(id._id)) return null;
      
    return await SubtaskModel.find({ parentTaskId: id._id }).lean<ISubtask>().exec();
    
  } catch (error) {
    console.error('Error fetching subtask by ID:', error);
    return null;
  }
};

/**
 * Update Subtask by ID with partial data
 */
export const updateSubtask = async (
  id: string,
  updateData: Partial<ISubtask>
) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid subtask ID", 400);
    }

    const subtask:any = await SubtaskModel.findById(id).exec();
    if (!subtask) {
      return errorResponse("Subtask not found", 404);
    }

    let message = "Subtask updated successfully";

    // Handle assignees array
    if (updateData.assignees && Array.isArray(updateData.assignees)) {
      const existingAssignees = subtask.assignees.map((a:any) => a.toString());
      const newAssignees = updateData.assignees.map(a => a.toString());

      // Find duplicates
      const duplicates = newAssignees.filter(a => existingAssignees.includes(a));
      if (duplicates.length > 0) {
        message = `Assignee(s) already present: ${duplicates.join(", ")}`;
      }

      // Merge unique assignees only
      const mergedAssignees = Array.from(new Set([...existingAssignees, ...newAssignees]));
      subtask.assignees = mergedAssignees;
      delete updateData.assignees;
    }

    // Update other fields
    Object.assign(subtask, updateData);

    const updatedSubtask = await subtask.save();
    return successResponse(updatedSubtask.toObject(), message, 200);
  } catch (error) {
    console.error("Error updating subtask:", error);
    return errorResponse("Failed to update subtask", 500, error);
  }
};
/**
 * Delete Subtask by ID
 */
export const deleteSubtasksByParentIdDao  = async (id: string): Promise<ISubtask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;

    const deletedSubtask = await SubtaskModel.findByIdAndDelete(id).lean<ISubtask>().exec();
    return deletedSubtask;
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return null;
  }
};

/**
 * Get all subtasks for a given parent task ID
 */
export const getSubtasksByParentId = async (parentTaskId: string): Promise<ISubtask[]> => {
  try {
    if (!Types.ObjectId.isValid(parentTaskId)) return [];

    return await SubtaskModel.find({ parentTaskId }).exec();
  } catch (error) {
    console.error('Error fetching subtasks by parent task ID:', error);
    return [];
  }
};
