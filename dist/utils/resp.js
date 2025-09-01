"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message = "Success", status = 200) => {
    return {
        status,
        success: true,
        message,
        data
    };
};
exports.successResponse = successResponse;
const errorResponse = (message = "Error", status = 400, details) => {
    return {
        status,
        success: false,
        message,
        error: details
    };
};
exports.errorResponse = errorResponse;
