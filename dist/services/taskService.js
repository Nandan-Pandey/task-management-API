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
exports.assignTaskUsers = exports.getTaskById = exports.getAllTasksWithSubtaskTitlesService = exports.createTask = void 0;
const mongoose_1 = require("mongoose");
const resp_1 = require("../utils/resp");
const taskDao_1 = require("../dao/taskDao");
const ALLOWED_STATUSES = ["To Do", "In Progress", "Done", "Blocked"];
const FIBONACCI_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];
const createTask = (taskData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!taskData.assignees || taskData.assignees.length === 0) {
            return (0, resp_1.errorResponse)("At least one assignee is required", 400);
        }
        if (taskData.status && !ALLOWED_STATUSES.includes(taskData.status)) {
            return (0, resp_1.errorResponse)(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`, 400);
        }
        if (taskData.storyPoints !== undefined &&
            !FIBONACCI_STORY_POINTS.includes(taskData.storyPoints)) {
            return (0, resp_1.errorResponse)(`Story points must be one of: ${FIBONACCI_STORY_POINTS.join(", ")}`, 400);
        }
        taskData.statusHistory = [
            {
                from: "Created",
                to: taskData.status || "To Do",
                timestamp: new Date(),
            },
        ];
        const task = yield (0, taskDao_1.createTaskDao)(taskData);
        return (0, resp_1.successResponse)(task, "Task created successfully", 201);
    }
    catch (error) {
        return (0, resp_1.errorResponse)(error.message || "Failed to create task", 500, error);
    }
});
exports.createTask = createTask;
const getAllTasksWithSubtaskTitlesService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, taskDao_1.getAllTasks)();
        const results = yield Promise.all(tasks.map((task) => __awaiter(void 0, void 0, void 0, function* () {
            const subtasks = yield (0, taskDao_1.getSubtasksByParentIdWithProjection)(task._id.toString(), { title: 1 });
            return { task, subtaskTitles: subtasks.map((st) => st.title) };
        })));
        return (0, resp_1.successResponse)(results, "Fetched tasks successfully", 200);
    }
    catch (error) {
        return (0, resp_1.errorResponse)(error.message || "Failed to fetch tasks", 500, error);
    }
});
exports.getAllTasksWithSubtaskTitlesService = getAllTasksWithSubtaskTitlesService;
const getTaskById = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield (0, taskDao_1.getTaskByIdDao)(taskId);
        if (!task) {
            return (0, resp_1.errorResponse)("Task not found", 404);
        }
        return (0, resp_1.successResponse)(task, "Fetched task successfully", 200);
    }
    catch (error) {
        return (0, resp_1.errorResponse)(error.message || "Failed to fetch task", 500, error);
    }
});
exports.getTaskById = getTaskById;
const assignTaskUsers = (taskId, assignees) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!assignees || assignees.length === 0) {
            return (0, resp_1.errorResponse)("At least one assignee is required", 400);
        }
        const assigneeObjectIds = assignees.map((id) => new mongoose_1.Types.ObjectId(id));
        const updatedTask = yield (0, taskDao_1.updateTaskDao)(taskId, {
            assignees: assigneeObjectIds,
        });
        return (0, resp_1.successResponse)(updatedTask, "Task users assigned successfully", 200);
    }
    catch (error) {
        return (0, resp_1.errorResponse)(error.message || "Failed to assign users", 500, error);
    }
});
exports.assignTaskUsers = assignTaskUsers;
