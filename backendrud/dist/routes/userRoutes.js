"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userRouter = express_1.default.Router();
userRouter.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        const users = await User_1.User.find().select('-password');
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = userRouter;
