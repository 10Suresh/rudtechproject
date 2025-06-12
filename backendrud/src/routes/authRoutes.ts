import express from 'express';
import { loginUser, registerUser, getCurrentUser } from '../controllers/authController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// ✅ Protected route with token verification
router.get('/current', authenticateToken, getCurrentUser);

export default router;
