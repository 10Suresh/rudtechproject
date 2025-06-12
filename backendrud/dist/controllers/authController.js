"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
// ==========================
// Register User
// ==========================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email is already registered.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ name, email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
        res.status(201).json({
            success: true,
            message: 'Registration successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({
            success: false,
            message: 'Registration failed.',
            error: err.message || 'Internal server error'
        });
    }
};
exports.registerUser = registerUser;
// ==========================
// Login User
// ==========================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, message: 'Email is not registered.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid password.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({
            success: false,
            message: 'Login failed.',
            error: err.message || 'Internal server error'
        });
    }
};
exports.loginUser = loginUser;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        console.error('Fetch current user error:', err);
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};
exports.getCurrentUser = getCurrentUser;
