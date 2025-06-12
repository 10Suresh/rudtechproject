import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
	throw new Error('JWT_SECRET is not defined in environment variables');
}

// ==========================
// Register User
// ==========================
export const registerUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ success: false, message: 'Email is already registered.' });
			return;
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });
		const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
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
	} catch (err: any) {
		console.error('Registration Error:', err);
		res.status(500).json({
			success: false,
			message: 'Registration failed.',
			error: err.message || 'Internal server error'
		});
	}
};

// ==========================
// Login User
// ==========================
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).json({ success: false, message: 'Email is not registered.' });
			return;
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ success: false, message: 'Invalid password.' });
			return;
		}

		const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
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
	} catch (err: any) {
		console.error('Login Error:', err);
		res.status(500).json({
			success: false,
			message: 'Login failed.',
			error: err.message || 'Internal server error'
		});
	}
};
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (err: any) {
    console.error('Fetch current user error:', err);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};