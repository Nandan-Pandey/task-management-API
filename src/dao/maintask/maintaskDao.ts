
import { Types, type ProjectionType } from 'mongoose';
import { ITask, TaskModel } from '../../models/taskModel';
import { ISubtask, SubtaskModel } from '../../models/subtaskModel';

/**
 * Create a new Task
 */
export const createTaskDao = async (taskData: Partial<ITask>): Promise<ITask> => {
  try {
    const task = new TaskModel(taskData);
    return await task.save();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};


export const getSubtasksByParentIdWithProjection = async (
  parentTaskId: string,
  projection: ProjectionType<ISubtask>
) => {
  if (!Types.ObjectId.isValid(parentTaskId)) return [];
  return await SubtaskModel.find({ parentTaskId }, projection).exec();
};

/**
 * Get Task by ID
 */
export const getTaskByIdDao = async (id: any): Promise<ITask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;
    

 return await TaskModel.findById(id).lean().exec();
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

/**
 * Update Task by ID with partial data
 */
export const updateTaskDao = async (id: string, updateData: Partial<ITask>): Promise<ITask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;
    return await TaskModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete Task by ID
 */
export const deleteTask = async (id: string): Promise<ITask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;

    // Use .lean() to return a plain JS object
    const deletedTask = await TaskModel.findByIdAndDelete(id).lean<ITask>().exec();
    return deletedTask;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

/**
 * Get all tasks (optional filter example)
 */
export const getAllTasks = async (): Promise<ITask[]> => {
  try {
    return await TaskModel.find().exec();
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    throw error;
  }
};
