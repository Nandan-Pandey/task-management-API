"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtaskModel = void 0;
const mongoose_1 = require("mongoose");
const subtaskSchema = new mongoose_1.Schema({
    parentTaskId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    priority: { type: String },
    assignees: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, required: true },
    storyPoints: { type: Number },
    statusHistory: [
        {
            from: { type: String, required: true },
            to: { type: String, required: true },
            timestamp: { type: Date, required: true }
        }
    ],
    comments: [
        {
            author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            timestamp: { type: Date, default: Date.now },
            text: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.SubtaskModel = (0, mongoose_1.model)('Subtask', subtaskSchema);
