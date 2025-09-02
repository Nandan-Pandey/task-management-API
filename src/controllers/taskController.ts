import { Types } from "mongoose";
import { ISubtask } from "../models/subtaskModel";
import { ITask } from "../models/taskModel";
import {  createTaskService, deleteTaskRestrict, deleteTaskService, getAllTasksWithSubtaskTitlesService, getTaskWithSubtasksService, updateTaskWithSubtasksService } from "../services/maintask/mainTask";
import {  assignTaskOrSubtaskService, createSubtask, getSubtaskByIdService } from "../services/subTask/subTask";
import { getTaskByIdDao } from "../dao/maintask/maintaskDao";
import mongoose, { ClientSession } from "mongoose";
import { errorResponse, successResponse } from "../utils/resp";


export const createTaskController = async (req: any, res:any, next: any) => {
  try {
    const { subtasks, ...taskData } = req.body;

    if (!taskData || !taskData.title || !taskData.description) {
      return res
        .status(400)
        .json(errorResponse("Task title and description are required", 400));
    }

    const result = await createTaskService(taskData, subtasks);
    return res.status(result.status).json(result);

  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message, 500, error));
  }
};
export const getAllTasksWithSubtaskTitlesController = async (
  req: Request,
  res: any,
  next: any
) => {
  try {
    const result = await getAllTasksWithSubtaskTitlesService();
    return res.status(result.status).json(result);
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message, 500, error));
  }
};
export const updateTaskWithSubtasksController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const taskId = req.params.id;
    const { subtasks, ...taskData } = req.body;

 

    const result = await updateTaskWithSubtasksService(taskId, taskData, subtasks);
    return res.status(result.status).json(result);
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message, 500, error));
  }
};
export const getTaskWithSubtasksController = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const taskId = req.params.id;
    const response = await getTaskWithSubtasksService(taskId);
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { strategy } = req.query; // cascade | restrict

    const response = await deleteTaskService(id, strategy as string);
    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req: any, res: any, next: any) => {
  try {
    const taskId = req.params.id;
    const { assignees, status } = req.body;

    if ((!Array.isArray(assignees) || assignees.length === 0) && !status) {
      return res.status(400).json(errorResponse("Assignees or status is required"));
    }

    const response = await assignTaskOrSubtaskService(taskId, { assignees, status });
    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};
