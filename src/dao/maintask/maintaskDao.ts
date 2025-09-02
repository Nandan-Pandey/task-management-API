
import mongoose, { ClientSession, Types, type ProjectionType } from 'mongoose';
import { ITask, TaskModel } from '../../models/taskModel';
import { ISubtask, SubtaskModel } from '../../models/subtaskModel';

/**
 * Create a new Task
 */



/**
 * Update Task by ID with partial data
 */



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

export const createTaskDao = async (
  taskData: Partial<ITask>,
  session?: ClientSession
): Promise<ITask> => {
  try {
    const task = new TaskModel(taskData);
    const savedTask = await task.save({ session });
    return savedTask.toObject();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error; // rethrow so service/controller can handle
  }
};


// ---------------------------------------------------------------------------------------------------------------------
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
    throw error; // rethrow so service/controller can handle
  }
};

export const getAllTasksDao = async (): Promise<ITask[]> => {
  try {
    return await TaskModel.find().exec();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// ✅ Fetch subtasks by parentTaskId with projection
export const getSubtasksByParentIdWithProjectionDao = async (
  parentTaskId: string,
  projection: ProjectionType<ISubtask>
) => {
  try {
    if (!Types.ObjectId.isValid(parentTaskId)) return [];
    return await SubtaskModel.find({ parentTaskId }, projection).exec();
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }
};



export const updateTaskDao = async (
  taskId: string,
  taskData: Partial<ITask>,
  session?: ClientSession
): Promise<ITask | null> => {
  try {
    const updated = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: taskData }, // only provided fields updated
      { new: true, session }
    ).exec();
    return updated ? updated.toObject() : null;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// ✅ Update Subtask
export const updateSubtaskDao = async (
  subtaskId: string,
  subtaskData: Partial<ISubtask>,
  session?: ClientSession
): Promise<ISubtask | null> => {
  try {
    const updated = await SubtaskModel.findByIdAndUpdate(
      subtaskId,
      { $set: subtaskData }, // only provided fields updated
      { new: true, session }
    ).exec();
    return updated ? updated.toObject() : null;
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
};

export const getTaskByIdDao = async (id: string): Promise<ITask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;
    return await TaskModel.findById(id).lean<ITask>().exec();
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

// Get subtasks by parent task ID
export const getSubtasksByParentIdDao = async (
  parentTaskId: string
): Promise<ISubtask[]> => {
  try {
    if (!Types.ObjectId.isValid(parentTaskId)) return [];
    return await SubtaskModel.find({ parentTaskId }).lean<ISubtask[]>().exec();
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }
};

export const countSubtasksByParentIdDao = async (taskId: string): Promise<number> => {
  try {
    return await SubtaskModel.countDocuments({ parentTaskId: taskId });
  } catch (error) {
    console.error("Error counting subtasks:", error);
    throw error;
  }
};

// Delete task
export const deleteTaskDao = async (id: string): Promise<ITask | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) return null;
    return await TaskModel.findByIdAndDelete(id).lean<ITask>().exec();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};





