// routes/userRoutes.ts
import express from 'express';
import { User } from '../models/User';
import authenticateToken from '../middleware/authMiddleware';

const userRouter = express.Router();

// GET all users - Protected
userRouter.get('/', authenticateToken, async (req, res) => {
	try {
		const users = await User.find().select('-password'); // Hide password
		res.json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

export default userRouter;
