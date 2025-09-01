import { Types } from 'mongoose';
import { ISubtask, SubtaskModel } from '../../models/subtaskModel';

/**
 * Create a new Subtask
 */
export const createSubtaskDao = async (subtaskData: Partial<ISubtask>): Promise<ISubtask | null> => {
  try {
    const subtask = new SubtaskModel(subtaskData);
    return await subtask.save();
  } catch (error) {
    console.error('Error creating subtask:', error);
    return null;
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
export const updateSubtask = async (id: string, updateData: Partial<ISubtask>): Promise<ISubtask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;

    return await SubtaskModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Error updating subtask:', error);
    return null;
  }
};

/**
 * Delete Subtask by ID
 */
export const deleteSubtask = async (id: string): Promise<ISubtask | null> => {
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
