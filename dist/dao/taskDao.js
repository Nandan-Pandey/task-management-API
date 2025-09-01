"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = exports.deleteTask = exports.updateTaskDao = exports.getTaskByIdDao = exports.getSubtasksByParentIdWithProjection = exports.createTaskDao = void 0;
const subtaskModel_js_1 = require("../models/subtaskModel.js");
const taskModel_js_1 = require("../models/taskModel.js");
const mongoose_1 = require("mongoose");
/**
 * Create a new Task
 */
const createTaskDao = (taskData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new taskModel_js_1.TaskModel(taskData);
        return yield task.save();
    }
    catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
});
exports.createTaskDao = createTaskDao;
const getSubtasksByParentIdWithProjection = (parentTaskId, projection) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(parentTaskId))
        return [];
    return yield subtaskModel_js_1.SubtaskModel.find({ parentTaskId }, projection).exec();
});
exports.getSubtasksByParentIdWithProjection = getSubtasksByParentIdWithProjection;
/**
 * Get Task by ID
 */
const getTaskByIdDao = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return yield taskModel_js_1.TaskModel.findById(id).exec();
    }
    catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
});
exports.getTaskByIdDao = getTaskByIdDao;
/**
 * Update Task by ID with partial data
 */
const updateTaskDao = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return yield taskModel_js_1.TaskModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
});
exports.updateTaskDao = updateTaskDao;
/**
 * Delete Task by ID
 */
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return yield taskModel_js_1.TaskModel.findByIdAndDelete(id).lean().exec();
    }
    catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
});
exports.deleteTask = deleteTask;
/**
 * Get all tasks (optional filter example)
 */
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield taskModel_js_1.TaskModel.find().exec();
    }
    catch (error) {
        console.error("Error fetching all tasks:", error);
        throw error;
    }
});
exports.getAllTasks = getAllTasks;
