"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Register route
router.post('/register', authController_1.registerUser);
// Login route
router.post('/login', authController_1.loginUser);
// Protected route with token verification
router.get('/current', authMiddleware_1.default, authController_1.getCurrentUser);
exports.default = router;
