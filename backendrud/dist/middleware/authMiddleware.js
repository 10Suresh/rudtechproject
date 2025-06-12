"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: 'JWT secret not configured' });
        return;
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Token is not valid' });
            return;
        }
        req.user = decoded;
        next();
    });
};
exports.default = authenticateToken;
