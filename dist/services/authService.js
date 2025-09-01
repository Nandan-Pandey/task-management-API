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
exports.loginUser = void 0;
const authdao_1 = require("../dao/authdao");
const auth_1 = require("../utils/auth");
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authdao_1.findUserByEmail)(email);
    if (!user) {
        return { status: 401, message: 'Invalid credentials' };
    }
    const isMatch = yield (0, auth_1.comparePassword)(password, user.password);
    if (!isMatch) {
        return { status: 401, message: 'Invalid credentials' };
    }
    const token = (0, auth_1.generateToken)(user._id.toString());
    return { status: 200, token };
});
exports.loginUser = loginUser;
