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
exports.assignSubtaskUsers = exports.getTaskWithSubtasks = exports.getAllTasksWithSubtaskTitles = exports.createTaskS = void 0;
const subtaskService_js_1 = require("../services/subtaskService.js");
const taskService_js_1 = require("../services/taskService.js");
const ALLOWED_STATUSES = ['To Do', 'In Progress', 'Done', 'Blocked'];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];
const createTaskS = (taskData, subtasks) => __awaiter(void 0, void 0, void 0, function* () {
    // Task validation
    if (!taskData.title || !taskData.description) {
        throw new Error('Title and description are required');
    }
    if (!taskData.assignees || taskData.assignees.length === 0) {
        throw new Error('At least one assignee is required');
    }
    if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
        throw new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    }
    if (taskData.storyPoints !== undefined && !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)) {
        throw new Error(`Story points must be one of: ${FIBONACCI_STORY_POINTS.join(', ')}`);
    }
    // Initialize status history
    taskData.statusHistory = [{
            from: 'Created',
            to: (taskData === null || taskData === void 0 ? void 0 : taskData.status) || 'To Do',
            timestamp: new Date()
        }];
    //   // Simulate notification
    //   const assigneeIds = taskData.assignees.map(a => a.toString());
    //   console.log(`Task '${taskData.title}' assigned to [${assigneeIds.join(', ')}] on ${new Date().toISOString()}`);
    // Create Task
    const createdTask = yield (0, taskService_js_1.createTask)(taskData);
    let createdSubtasks = [];
    // Create Subtasks
    if (subtasks && subtasks.length > 0) {
        for (const subtaskData of subtasks) {
            // Subtask must reference parentTaskId
            subtaskData.parentTaskId = createdTask === null || createdTask === void 0 ? void 0 : createdTask._id; // Set parent task ID
            // Subtask Validation
            if (!subtaskData.title || !subtaskData.description) {
                throw new Error('Each subtask requires a title and description');
            }
            if (!subtaskData.assignees || subtaskData.assignees.length === 0) {
                throw new Error('Each subtask must have at least one assignee');
            }
            if (subtaskData.status && !ALLOWED_STATUSES.includes(subtaskData.status)) {
                throw new Error(`Subtask status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
            }
            if (subtaskData.storyPoints !== undefined && !FIBONACCI_STORY_POINTS.includes(subtaskData.storyPoints)) {
                throw new Error(`Subtask story points must be one of: ${FIBONACCI_STORY_POINTS.join(', ')}`);
            }
            subtaskData.statusHistory = [{
                    from: 'Created',
                    to: subtaskData.status || 'To Do',
                    timestamp: new Date()
                }];
            subtaskData.createdAt = new Date();
            subtaskData.updatedAt = new Date();
            // Simulate notification
            const subAssignees = subtaskData.assignees.map(a => a.toString());
            console.log(`Subtask '${subtaskData.title}' assigned to [${subAssignees.join(', ')}] on ${new Date().toISOString()}`);
            // Save subtask
            const createdSubtask = yield (0, subtaskService_js_1.createSubtask)(subtaskData);
            createdSubtasks.push(createdSubtask);
        }
    }
    return { task: createdTask, subtasks: createdSubtasks };
});
exports.createTaskS = createTaskS;
const getAllTasksWithSubtaskTitles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, taskService_js_1.getAllTasksWithSubtaskTitlesService)();
    }
    catch (error) {
        throw error;
    }
});
exports.getAllTasksWithSubtaskTitles = getAllTasksWithSubtaskTitles;
const getTaskWithSubtasks = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield (0, taskService_js_1.getTaskById)(taskId);
        if (!task)
            return null;
        const subtasks = yield (0, subtaskService_js_1.getSubtaskByIdService)(taskId);
        return { task, subtasks };
    }
    catch (error) {
        throw error;
    }
});
exports.getTaskWithSubtasks = getTaskWithSubtasks;
const assignSubtaskUsers = (taskId, assignees) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validation can be added here if needed
        const updatedTask = yield (0, subtaskService_js_1.assignSubtaskUsersService)(taskId, assignees);
        return updatedTask;
    }
    catch (error) {
        throw error;
    }
});
exports.assignSubtaskUsers = assignSubtaskUsers;
