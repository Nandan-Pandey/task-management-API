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
exports.getSubtasksByParentId = exports.deleteSubtask = exports.updateSubtask = exports.getSubtaskById = exports.createSubtask = void 0;
const subtaskModel_js_1 = require("../models/subtaskModel.js");
const mongoose_1 = require("mongoose");
/**
 * Create a new Subtask
 */
const createSubtask = (subtaskData) => __awaiter(void 0, void 0, void 0, function* () {
    const subtask = new subtaskModel_js_1.SubtaskModel(subtaskData);
    return yield subtask.save();
});
exports.createSubtask = createSubtask;
/**
 * Get Subtask by ID
 */
const getSubtaskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return yield subtaskModel_js_1.SubtaskModel.findById(id).exec();
});
exports.getSubtaskById = getSubtaskById;
/**
 * Update Subtask by ID with partial data
 */
const updateSubtask = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return yield subtaskModel_js_1.SubtaskModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
});
exports.updateSubtask = updateSubtask;
/**
 * Delete Subtask by ID
 */
const deleteSubtask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    const deleted = yield subtaskModel_js_1.SubtaskModel.findByIdAndDelete(id).lean().exec();
    return deleted;
});
exports.deleteSubtask = deleteSubtask;
/**
 * Get all subtasks for a given parent task ID
 */
const getSubtasksByParentId = (parentTaskId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(parentTaskId))
        return [];
    return yield subtaskModel_js_1.SubtaskModel.find({ parentTaskId }).exec();
});
exports.getSubtasksByParentId = getSubtasksByParentId;
