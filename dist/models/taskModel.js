"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    priority: { type: String },
    assignees: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, required: true },
    storyPoints: { type: Number },
    statusHistory: [
        {
            from: { type: String }, //previous status
            to: { type: String, required: true }, //new status
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
exports.TaskModel = (0, mongoose_1.model)('Task', taskSchema);
